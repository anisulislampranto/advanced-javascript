const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

//TODO Insecure

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    for (const id of req.body) {
      // Build Filter Object 
      const filterObject = { _id: id };
      if (process.env.SHELL_MODE === 'team') filterObject.team = req.currentTeam._id;

      await Model.findOneAndDelete(filterObject);
    }

    // TODO If one Deletion fails because document doesn't exist anymore
    // It should return some sort of error, without interrupting the deletion process
    // of the other documents
    if (false) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    // Build Filter Object 
    const filterObject = { _id: id };
    if (process.env.SHELL_MODE === 'team') filterObject.team = req.currentTeam._id;

    const doc = await Model.findOneAndUpdate(filterObject, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // Append Team if Shell Mode is Team
    const dataToAdd = { ...req.body };
    if (process.env.SHELL_MODE === 'team') dataToAdd.team = req.currentTeam._id;

    const doc = await Model.create(dataToAdd);

    res.status(201).json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // Build Filter Object 
    const filterObject = { _id: id };
    if (process.env.SHELL_MODE === 'team') filterObject.team = req.currentTeam._id;

    let query = Model.findOne(filterObject);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {

    // Build Filter Object 
    const filterObject = {};
    if (process.env.SHELL_MODE === 'team') filterObject.team = req.currentTeam._id;


    const features = new APIFeatures(Model.find(filterObject), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs
    });
  });
