const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { makeId } = require("../../utils/utilityFunctions");

const notificationSchema = new mongoose.Schema({
  title: String,
  text: String,
  icon: Object,
  color: String,
  persistent: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["standard", "invitation", "verifyEmail"],
    default: "standard",
  },
  important: {
    type: Boolean,
    default: false,
  },

  invitationId: String,
});

let userSchemaObject = {
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  language: String,
  profilePicture: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
      },
      message:
        "Password needs to contain at least 8 characters, an uppercase letter, a lowercase letter, and a number.",
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  emailConfirmToken: {
    type: String,
    select: false,
  },
  // used in 2 step email change
  emailConfirmToken2: {
    type: String,
    select: false,
  },
  emailConfirmExpires: {
    type: Date,
    select: false,
  },
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  // used to pre-save new email before confirmation
  newEmail: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  referralCode: String,
  referrer: String,

  notifications: [notificationSchema],
  twoFAEnabled: {
    type: Boolean,
    default: false,
  },
  twoFASecret: {
    type: String,
    select: false,
  },
  // Used for enabling 2FA
  twoFASecretBuffer: {
    type: String,
    select: false,
  },

  showWelcome: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
};

// Add Team Attributes if Shell Mode is Team
if (process.env.SHELL_MODE === "team") {
  userSchemaObject.activeTeam = {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  };

  userSchemaObject.teamMemberships = [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
    },
  ];
}

// Try to import the User Template Model, and add it to the current Model
try {
  const userTemplateSchema = require("../../../templateModels/userTemplateModel.js");
  userSchemaObject = {
    ...userTemplateSchema.obj,
    ...userSchemaObject,
  };
} catch (error) {
  console.log("No User Template Model found");
}

const userSchema = new mongoose.Schema(userSchemaObject);

// Generate Referral Code
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate Referral Code until it is unique
    let id;
    for (;;) {
      id = makeId(8);
      console.log(id);
      const exists = await User.exists({ referralCode: id });
      console.log(exists);
      if (!exists) break;
    }

    this.referralCode = id;
  }
  next();
});

// Self-Heal: Fill Active Team if it has been somehow lost
// If there is a team Membership, there is always an active Team
userSchema.pre("save", async function (next) {
  if (
    process.env.SHELL_MODE === "team" &&
    !this.activeTeam &&
    this.teamMemberships?.length
  ) {
    this.activeTeam = this.teamMemberships[0];
  }

  next();
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailConfirmToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  const digestedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Valid for 1 Month
  const expirationDate = Date.now() + 30 * 24 * 60 * 60 * 1000;

  return { token, digestedToken, expirationDate };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
