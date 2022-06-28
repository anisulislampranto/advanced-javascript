const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { makeId } = require("../../utils/utilityFunctions");

let teamSchemaObject = {
  name: {
    type: String,
    required: [true, "Please tell us the team name!"],
  },

  photo: {
    type: String,
    default: "default.png",
  },
  members: [
    {
      role: {
        type: String,
        default: "admin",
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
  ],
  invitations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Invitation",
    },
  ],

  plan: {
    type: String,
    default: "trial",
  }, // trial, single, team, ... ?
  activeModules: {
    type: Array,
    default: [],
  },

  accessRoles: {
    select: false,
    type: Object,
    default: {
      admin: "*",
    },
    /**
     * {
     * role-name: {
     *  documents: {
     *      readDocuments: true;
     *    },
     *  items: '*'
     *  }
     * }
     */
  },

  publicTeamId: String,

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
  const teamTemplateSchema = require("../../../templateModels/teamTemplateModel.js");
  teamSchemaObject = {
    ...teamTemplateSchema.obj,
    ...teamSchemaObject,
  };
} catch (error) {
  // console.log(error);
  console.log("No team template model found");
}

const teamSchema = new mongoose.Schema(teamSchemaObject);

// Generate Public Team ID
teamSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate ID until it is unique
    let id;
    for (;;) {
      id = makeId(8);
      const exists = await Team.exists({ publicTeamId: id });
      if (!exists) break;
    }

    this.publicTeamId = id;
  }
  next();
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
