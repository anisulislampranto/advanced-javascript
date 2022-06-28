const mongoose = require("mongoose");
const { makeId } = require("../../utils/utilityFunctions");
const validator = require("validator");

let invitationSchemaObject = {
  invitingUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  invitedEmail: {
    type: String,
    unique: true,
    lowercase: true,
  },
  invitedUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  role: String,
  team: {
    type: mongoose.Schema.ObjectId, // Contains the Public Team ID
    ref: "Team",
  },
  publicInvitationId: String,

  expirationDate: Date,

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
};

// Try to import the Team Template Model, and add it to the current Model
try {
  const invitationTemplateSchema = require("../../../templateModels/invitationTemplateModel.js");
  invitationSchemaObject = {
    ...invitationTemplateSchema.obj,
    ...invitationSchemaObject,
  };
} catch (error) {
  // console.log(error);
  console.log("No invitation template model found");
}

const invitationSchema = new mongoose.Schema(invitationSchemaObject);

// Generate Public Team ID
invitationSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate ID until it is unique
    let id;
    for (;;) {
      id = makeId(16);
      const exists = await Invitation.exists({ publicInvitationId: id });
      if (!exists) break;
    }

    this.publicInvitationId = id;
  }
  next();
});

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = Invitation;
