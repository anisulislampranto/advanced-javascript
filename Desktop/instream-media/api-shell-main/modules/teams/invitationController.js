const catchAsync = require("../../utils/catchAsync");
const sendEmail = require("../../utils/email");
const User = require("../users/userModel");
const Team = require("./teamModel");
const AppError = require("../../utils/appError");
const Invitation = require("./invitationModel");

// Creates Invitation Document, and either sends an invitation Email,
// or notification to join team to an existing user
exports.createInvitation = catchAsync(async (req, res, next) => {
  // Validate Input
  if (!req.body.email || !req.body.role) {
    return next(new AppError("Missing Data", 400, 400004));
  }

  // Check if User exists
  const user = await User.findOne({ email: req.body.email });

  // Check if Invitation already exists
  const currentTeam = await Team.findById(req.currentTeam._id).populate(
    "invitations"
  );
  const currentInvitations = currentTeam.invitations;
  if (user) {
    // User
    if (currentInvitations.map((el) => el.invitedUser).includes(user._id)) {
      return next(new AppError("Invitation already exists", 400, 400007));
    }
  } else {
    // Email
    if (
      currentInvitations.map((el) => el.invitedEmail).includes(req.body.email)
    ) {
      return next(new AppError("Invitation already exists", 400, 400007));
    }
  }

  // Build invitation Object
  const invitationObj = {
    role: req.body.role,
    invitingUser: req.user._id,
    expirationDate: new Date(
      Date.now() + process.env.INVITATION_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    team: req.currentTeam._id,
  };
  if (user) invitationObj.invitedUser = user._id;
  else invitationObj.invitedEmail = req.body.email;

  // Create Invitation Document
  const invitation = await Invitation.create(invitationObj);

  // Link Invitation in Team Doc
  await Team.findByIdAndUpdate(
    req.currentTeam._id,
    {
      $push: {
        invitations: invitation._id,
      },
    },
    { new: true }
  );

  if (user) {
    // Send Notification to join Team
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: {
          notifications: {
            title: `Join ${req.currentTeam.name}`,
            text: `You have been invited to join ${req.currentTeam.name}`,
            teamId: req.currentTeam._id,
            type: "invitation",
            important: true,
            invitationId: invitation.publicInvitationId,
          },
        },
      },
      { new: true }
    );
  } else {
    console.log("sending invitation email");
    console.log(process.env.EMAIL_FROM_ADDRESS);
    // Send Invitation Email
    const url = `${process.env.FRONTEND_URL}/signup?invite=${invitation.publicInvitationId}`;
    await sendEmail({
      to: req.body.email,
      from: `${req.user.name} <${process.env.EMAIL_FROM_ADDRESS}>`,
      subject: `Join ${req.currentTeam.name} on Warest`,
      template: "invitation",
      data: { url },
    });
  }

  res.status(200).json({
    status: "success",
    message: "Invitation sent successfully!",
  });
});

// Delete Invitation
exports.deleteInvitation = catchAsync(async (req, res, next) => {
  // Delete Invitation Document
  const invitation = await Invitation.findByIdAndDelete(
    req.params.invitationId
  );

  // Remove Notification from invited user
  if (invitation.invitedUser) {
    await User.findByIdAndUpdate(
      invitation.invitedUser,
      {
        notifications: {
          $pull: {
            invitationId: invitation.publicInvitationId,
          },
        },
      },
      { new: true }
    );
  }

  // Remove Invitation from Team Document
  await Team.findByIdAndUpdate(req.currentTeam._id, {
    $pull: {
      invitations: invitation._id,
    },
  });

  res.status(200).json({
    status: "success",
  });
});

// Check if Invitation is valid middleware
exports.validateInvitation = catchAsync(async (req, res, next) => {
  const invitationId = req.body.invitationId || req.params.invitationId;

  const invitation = await Invitation.findOne({
    publicInvitationId: invitationId,
  })
    .populate("invitingUser")
    .populate("team");

  // Check if Invitation Exists
  if (!invitation)
    return next(new AppError("Invitation does not exist!", 400, 400005));

  // Check if invitation has expired
  const expirationDate = new Date(invitation.expirationDate);
  if (Date.now() > expirationDate.getTime()) {
    return next(new AppError("Invitation has expired!", 400, 400003));
  }

  req.invitation = invitation;

  next();
});

// Send back invitation Data (protected by Invitation validation)
exports.getInvitation = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.invitation,
  });
});

// Accept Invitation as authenticated User
// Protected by invitation validation middleware
exports.acceptInvitation = catchAsync(async (req, res, next) => {
  // Add User to Team Members
  const team = await Team.findByIdAndUpdate(req.invitation.team, {
    $push: {
      members: {
        user: req.user._id,
        role: req.invitation.role,
      },
    },
    $pull: {
      invitations: req.invitation._id,
    },
  });

  // Add Team to user Memberships & set as active Team
  const newUser = await User.findByIdAndUpdate(req.user._id, {
    activeTeam: team._id,
    $push: {
      teamMemberships: team._id,
    },
    $pull: {
      notifications: {
        invitationId: req.invitation.publicInvitationId,
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: newUser,
  });
});
