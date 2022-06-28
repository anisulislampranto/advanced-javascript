const catchAsync = require("../../utils/catchAsync");
const User = require("../users/userModel");
const Team = require("./teamModel");
const factory = require("../../controllers/handlerFactory");
const AppError = require("../../utils/appError");
const { createLogEntry } = require("../log/logController");

exports.createTeam = catchAsync(async (req, res, next) => {
  // Create Team Doc
  const team = await Team.create({
    name: req.body.name,
    members: [
      {
        user: req.user._id,
        role: "admin",
      },
    ],
  });

  // Add Team doc to team memberships array in user doc
  // Set new team as active Team
  await User.findByIdAndUpdate(req.user._id, {
    $push: { teamMemberships: team._id },
    activeTeam: team._id,
  });

  // Create Log Entry
  createLogEntry(
    200101,
    {
      type: "team",
      user: req.user._id,
      team: team._id,
    },
    [req.user._id],
    [team._id]
  );

  res.status(201).json({
    status: "success",
    data: team,
  });
});

async function checkMembership(teamId, userId) {
  // Check Team Memberships
  const team = await Team.findById(teamId);
  const members = team.members.map((el) => el.user.toString());
  if (!members.includes(userId.toString())) {
    return next(new AppError("You are not a member of this team!", 400));
  }
  return team;
}

exports.joinTeam = catchAsync(async (req, res, next) => {
  const teamId = req.body.team;

  const team = await checkMembership(teamId, req.user._id);

  // Add Team doc to team memberships array in user doc
  // Set new team as active Team
  await User.findByIdAndUpdate(req.user._id, {
    $push: { teamMemberships: team._id },
    activeTeam: team._id,
  });

  // Create Log Entry
  createLogEntry(
    200102,
    {
      type: "team",
      user: req.user._id,
      team: team._id,
    },
    [req.user._id],
    [team._id]
  );

  res.status(201).json({
    status: "success",
    data: team,
  });
});

// Remove User from Team
exports.removeFromTeam = catchAsync(async (req, res, next) => {
  const user = req.body.user;

  // Remove Membership in Team Document
  await Team.findByIdAndUpdate(req.currentTeam._id, {
    $pull: {
      members: {
        user: user,
      },
    },
  });

  // Remove Team Membership in User Document
  await User.findByIdAndUpdate(user, {
    $pull: {
      teamMemberships: req.currentTeam._id,
    },
  });

  // Create Log Entry
  createLogEntry(
    200103,
    {
      type: "team",
      user: req.user._id,
    },
    [req.user._id],
    [req.currentTeam._id]
  );

  res.status(201).json({
    status: "success",
    message: "User removed from team!",
  });
});

exports.switchTeam = catchAsync(async (req, res, next) => {
  const teamId = req.body.team;

  if (!teamId)
    return next(new AppError("No Team ID Specified to switch to", 400));

  await checkMembership(teamId, req.user._id);

  // Add Team doc to team memberships array in user doc
  // Set new team as active Team
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { activeTeam: teamId },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.getCurrent = (req, res, next) => {
  req.params.id = req.user.activeTeam;
  next();
};

// Leaving Team
exports.leaveTeam = catchAsync(async (req, res, next) => {
  const user = req.user;

  await Team.findByIdAndUpdate(req.currentTeam._id, {
    $pull: {
      members: {
        user: user,
      },
    },
  });

  // Create Log Entry
  createLogEntry(
    200103,
    {
      type: "team",
      user: req.user._id,
    },
    [req.user._id],
    [req.currentTeam._id]
  );

  res.status(201).json({
    status: "success",
    message: "User left the team!",
  });
});

exports.getTeam = factory.getOne(Team);
