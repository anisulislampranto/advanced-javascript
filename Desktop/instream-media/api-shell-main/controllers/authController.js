const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../modules/users/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { createLogEntry } = require("../modules/log/logController");
const fs = require("fs");
const path = require("path");

const Team = require("../modules/teams/teamModel");
const Invitation = require("../modules/teams/invitationModel");

const pathToKey = path.join(__dirname, "..", "..", "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

// Sends token back to client as http only cookie
const createSendToken = (user, statusCode, internalStatusCode, req, res) => {
  const payload = {
    id: user._id,
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: "RS256",
  });

  res.cookie("jwt", signedToken, {
    expires: req.body.rememberMe
      ? new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        )
      : 0,
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    internalStatusCode,
    token: signedToken,
    data: {
      user,
    },
  });
};

// Sign up new User
exports.signup = catchAsync(async (req, res, next) => {
  const userObj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };

  // Check for invitation
  let invitation;
  let team;
  if (process.env.SHELL_MODE === "team" && req.body.publicInvitationId) {
    invitation = await Invitation.findOne({
      publicInvitationId: req.body.publicInvitationId,
    });
    team = await Team.findById(invitation.team);

    if (!invitation || !team) {
      return next(new AppError("Invalid invitation", 400, 400005));
    }

    userObj.activeTeam = team._id;
    userObj.teamMemberships = [team._id];
  }

  // Save User to Database
  const user = await User.create(userObj);

  // Update Team with new User
  // Only gets triggered if SHELL_MODE is team -> Invitation != undefined
  if (invitation) {
    // Add User to Team Members
    await Team.findByIdAndUpdate(invitation.team, {
      $push: {
        members: {
          user: user._id,
          role: invitation.role,
        },
      },
      $pull: {
        invitations: invitation._id,
      },
    });
  }

  // Send Email Verification Email

  // 2) Generate the random email confirm token
  const { token, digestedToken, expirationDate } =
    user.createEmailConfirmToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const confirmUrl = `${process.env.FRONTEND_URL}/confirmemail?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Please confirm your email",
      template: "confirmEmail",
      data: { user, confirmUrl },
    });

    user.emailConfirmToken = digestedToken;
    user.emailConfirmExpires = expirationDate;
    await user.save({ validateBeforeSave: false });
  } catch (err) {
    console.log(err);

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
      500001
    );
  }

  // Create Log Entry
  createLogEntry(
    200001,
    {
      type: "authentication",
      user: user._id,
    },
    [user._id],
    [user.currentTeam]
  );

  // Send auth Token back to user
  createSendToken(user, 201, 201001, req, res);
});

// Login User
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(
      new AppError("Please provide email and password!", 400, 400002)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("No user found", 401, 401001));
  }

  // Function defined at bottom of app.js
  const isValid = await user.correctPassword(password, user.password);

  if (!isValid) {
    return next(new AppError("Incorrect email or password", 401, 401006));
  }

  // Create Log Entry
  createLogEntry(
    200002,
    {
      type: "authentication",
      user: user._id,
    },
    [user._id],
    [user.currentTeam]
  );

  // 3) If everything ok, send token to client
  createSendToken(user, 200, 200001, req, res);
});

// Replace JWT Cookie with invalid cookie that expires quickly
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  // Create Log Entry
  createLogEntry(
    200003,
    {
      type: "authentication",
      user: req.user._id,
    },
    [req.user._id],
    [req.user.currentTeam]
  );

  res.status(200).json({ status: "success" });
};

exports.connectCurrentTeam = catchAsync(async (req, res, next) => {
  // Only gets executed if activeTeam is set
  // Check current Team & append
  let currentTeam;
  if (req.user.activeTeam) {
    let teamQuery = Team.findById(req.user.activeTeam);
    const populate = req.query.populate && JSON.parse(req.query.populate);

    if (populate)
      teamQuery = teamQuery
        .populate("members.user", "name email photo")
        .populate({
          path: "invitations",
          populate: {
            path: "invitedUser",
            model: "User",
          },
        });
    currentTeam = await teamQuery;
    // Check if user is member of team
    if (
      currentTeam.members
        .map((member) =>
          populate ? member.user._id.toString() : member.user.toString()
        )
        .indexOf(req.user._id.toString()) === -1
    ) {
      await User.findByIdAndUpdate(req.user._id, {
        activeTeam: null,
        $pull: {
          memberships: currentTeam._id,
        },
      });
    } else {
      req.currentTeam = currentTeam;
    }
  }
  next();
});

// Verifies 2FA Token
function verify2FAToken(token = "", secret = "") {
  if (!token || !secret) return false;
  // Verify 2FA Token
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "ascii",
    token: token,
  });
  return verified;
}

// Extended Protection Middleware: 2FA or Reauthentication
exports.strongProtect = catchAsync(async (req, res, next) => {
  // Check if User has 2FA enabled
  if (req.user.twoFAEnabled) {
    // Verify Token, then buffer token (used for enabling 2FA)
    let verified = verify2FAToken(req.body.twoFAToken, req.user.twoFASecret);
    if (!verified)
      verified = verify2FAToken(
        req.body.twoFAToken,
        req.user.twoFASecretBuffer
      );
    if (!verified)
      return next(new AppError("Your 2FA Code is wrong.", 401, 401005));
  } else {
    // Verify current Password
    const verified = await req.user.correctPassword(
      req.body.currentPassword,
      req.user.password
    );
    if (!verified)
      return next(new AppError("Your current password is wrong.", 401, 401004));
  }

  next();
});

// 2FA Protection Middleware. Forces 2FA
exports.twoFAProtect = catchAsync(async (req, res, next) => {
  // Verify normal token, then buffer Token
  let verified = verify2FAToken(req.body.twoFAToken, req.user.twoFASecret);
  if (!verified)
    verified = verify2FAToken(req.body.twoFAToken, req.user.twoFASecretBuffer);
  if (!verified)
    return next(new AppError("Your 2FA Code is wrong.", 401, 401005));

  next();
});

// Authorization Middleware
exports.restrict = (functionName) => {
  return (req, res, next) => {
    // Check if Email is confirmed
    if (!req.user.emailConfirmed) {
      return res.status(403).json({
        status: "warning",
        internalStatusCode: 403001,
        message: "Please confirm your email address to get access",
      });
    }

    // Only Check permissions if SHELL_MODE is team
    if (process.env.SHELL_MODE === "team" && functionName) {
      // Fetch Roles from Team Doc
      const membership = req?.currentTeam?.members?.find(
        (el) => el.user._id.toString() === req.user._id.toString()
      );
      const role = membership?.role;
      const section = functionName.split(".")[0];
      const action = functionName.split(".")[1];

      // Check if User has access to all actions of this resource, if not check
      // if he has access to the specific action
      // TODO check if empty functionName should be blocking or not
      if (role[section] === "*" || (role[section] && role[section][action])) {
        next();
      } else {
        return next(
          new AppError(
            "You do not have permission to perform this action",
            403,
            403000
          )
        );
      }
    } else {
      next();
    }
  };
};

// Reqest Password Reset Email
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("There is no user with email address.", 404, 404001)
    );
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Your Password reset Link",
      template: "reseetPassword",
      data: { user, resetUrl },
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
      500001
    );
  }
});

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Reset Password with token from Reset Password email
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400, 400006));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Create Log Entry
  createLogEntry(
    200004,
    {
      type: "authentication",
      user: user._id,
    },
    [user._id],
    [user.currentTeam]
  );

  // 4) Log the user in, send JWT
  createSendToken(user, 200, 200002, req, res);
});

// Confirm Email with token from Confirm Email email
exports.confirmEmailChange2 = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    emailConfirmToken2: hashedToken,
    emailConfirmExpires: { $gt: Date.now() },
  }).select("+newEmail");

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400, 400006));
  }
  user.email = user.newEmail;
  user.newEmail = undefined;
  user.emailConfirmToken2 = undefined;
  user.emailConfirmExpires = undefined;
  // user.notifications.splice(user.notifications.findIndex((el) => el.type === 'verifyEmail'), 1)
  await user.save({ validateBeforeSave: false });

  // Create Log Entry
  createLogEntry(
    200009,
    {
      type: "authentication",
      user: user._id,
    },
    [user._id],
    [user.currentTeam]
  );

  // 4) Log the user in, send JWT
  createSendToken(user, 200, 200003, req, res);
});

// Confirm Email Address with token sent to email address
exports.confirmEmail = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    emailConfirmToken: hashedToken,
    emailConfirmExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400, 400006));
  }
  user.emailConfirmed = true;
  user.emailConfirmToken = undefined;
  user.emailConfirmExpires = undefined;
  user.notifications.splice(
    user.notifications.findIndex((el) => el.type === "verifyEmail"),
    1
  );
  await user.save({ validateBeforeSave: false });

  // Send Welcome Email
  const url = `${process.env.FRONTEND_URL}/`;
  await sendEmail({
    to: user.email,
    subject: "Welcome!",
    template: "welcome",
    data: { user },
  });

  // Create Log Entry
  createLogEntry(
    200005,
    {
      type: "authentication",
      user: user._id,
    },
    [user._id],
    [user.currentTeam]
  );

  // 4) Log the user in, send JWT
  createSendToken(user, 200, 200003, req, res);
});

// Update Password as an authenticated User
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401, 401004));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // Create Log Entry
  createLogEntry(
    200006,
    {
      type: "authentication",
      user: user._id,
    },
    [user._id],
    [user.currentTeam]
  );

  // 4) Log user in, send JWT
  createSendToken(user, 200, 200004, req, res);
});

exports.confirmEmailChange1 = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    emailConfirmToken: hashedToken,
    emailConfirmExpires: { $gt: Date.now() },
  }).select("+newEmail");

  if (!user) {
    const secondTry = await User.findOne({
      emailConfirmToken2: hashedToken,
      emailConfirmExpires: { $gt: Date.now() },
    }).select("+newEmail");

    if (secondTry) return next();
    else
      return next(new AppError("Token is invalid or has expired", 400, 400006));
  }

  // 2) Generate the random email confirm token
  const { token, digestedToken, expirationDate } =
    user.createEmailConfirmToken();

  // 3) Send it to user's email
  try {
    const confirmUrl = `${process.env.FRONTEND_URL}/confirmemail?token=${token}&mode=confirmEmailChange`;
    await sendEmail({
      to: user.newEmail,
      subject: "Please confirm your new email address",
      template: "confirmEmailChange2",
      data: { user, confirmUrl },
    });

    user.emailConfirmToken = undefined;
    user.emailConfirmToken2 = digestedToken;
    user.emailConfirmExpires = expirationDate;
    await user.save({ validateBeforeSave: false });
  } catch (err) {
    console.log(err);

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
      500001
    );
  }

  res.status(200).json({
    status: "success",
    internalStatusCode: 200006,
    message: "Confirmation email sent to new email address.",
  });
});

exports.updateEmail = catchAsync(async (req, res, next) => {
  if (!req.body.email)
    return next(new AppError("Please provide an email", 400, 400002));

  const user = await User.findById(req.user._id);
  // 2) Generate the random email confirm token
  const { token, digestedToken, expirationDate } =
    user.createEmailConfirmToken();

  // 3) Send it to user's email
  try {
    const confirmUrl = `${process.env.FRONTEND_URL}/confirmemail?token=${token}&mode=confirmEmailChange`;
    await sendEmail({
      to: user.email,
      subject: "Please confirm your new email",
      template: "confirmEmailChange1",
      data: { user, confirmUrl },
    });

    user.newEmail = req.body.email;
    user.emailConfirmToken = digestedToken;
    user.emailConfirmExpires = expirationDate;
    await user.save({ validateBeforeSave: false });
  } catch (err) {
    console.log(err);

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
      500001
    );
  }

  res.status(200).json({
    status: "success",
    internalStatusCode: 200005,
    message: "Confirmation email sent to current email address.",
  });
});

// Simple Middleware to check if user is authenticated
// If yes, it returns current User and current Team
exports.checkAuthentication = catchAsync(async (req, res, next) => {
  const data = {
    user: req.user,
  };
  // Append Team Data if SHELL_MODE is team
  if (process.env.SHELL_MODE === "team") data.currentTeam = req.currentTeam;

  res.status(200).json({
    status: "success",
    internalStatusCode: 200001,
    data: data,
  });
});

//-----------------------SECTION 2FA---------------------------------

// Get 2 FA Code to bind authentication app
exports.getTwoFACode = catchAsync(async (req, res, next) => {
  //Create Secret and Store it in User Doc
  const secret = speakeasy.generateSecret({
    name: "Warest",
  });

  await User.findByIdAndUpdate(req.user._id, {
    twoFASecretBuffer: secret.ascii,
  });

  qrcode.toDataURL(secret.otpauth_url, function (err, dataUrl) {
    if (err)
      return next(new AppError("Something went wrong creating the QR Code!"));
    res.status(200).json({
      status: "success",
      data: dataUrl,
    });
  });
});

// Enable 2FA for User
exports.enableTwoFA = catchAsync(async (req, res, next) => {
  // PROTECT With 2FA Middleware

  await User.findByIdAndUpdate(req.user._id, {
    twoFAEnabled: true,
    twoFASecret: req.user.twoFASecretBuffer,
  });

  // Create Log Entry
  createLogEntry(
    200007,
    {
      type: "authentication",
      user: req.user._id,
    },
    [req.user._id],
    [req.user.currentTeam]
  );

  res.status(200).json({
    status: "success",
    message: "2FA activated successfully!",
  });
});

// Disable 2FA for user
exports.disableTwoFA = catchAsync(async (req, res, next) => {
  // PROTECT BY 2FA Middleware!

  await User.findByIdAndUpdate(req.user._id, {
    twoFASecret: null,
    twoFAEnabled: false,
  });

  // Create Log Entry
  createLogEntry(
    200008,
    {
      type: "authentication",
      user: req.user._id,
    },
    [req.user._id],
    [req.user.currentTeam]
  );

  res.status(200).json({
    status: "success",
    message: "2FA deactivated successfully!",
  });
});

//---------!SECTION------------
