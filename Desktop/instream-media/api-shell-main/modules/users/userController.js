const multer = require("multer");
const sharp = require("sharp");
const User = require("./userModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const factory = require("../../controllers/handlerFactory");
const mongoose = require("mongoose");
const path = require("path");
const { s3 } = require("../../../../server");
const multerS3 = require("multer-s3-transform");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const keyFunction = function (req, file, cb) {
  salt = null;
  //     const ext = file.mimetype.split('/')[1];
  const fileFormat =
    file.originalname.split(".")[file.originalname.split(".").length - 1];
  cb(
    null,
    `${"profilePictures/"}${req.user._id}${salt && `-${salt}`}.${fileFormat}`
  );
};

const metadataFunction = function (req, file, cb) {
  cb(null, { fieldName: file.fieldname, originalname: file.originalname });
};

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: metadataFunction,
    key: keyFunction,
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: "cropped",
        key: keyFunction,
        metadata: metadataFunction,
        transform: function (req, file, cb) {
          //Perform desired transformations
          cb(null, sharp().resize(600, 600));
        },
      },
    ],
  }),
  fileFilter: imageFilter,
});

exports.uploadUserPhoto = imageUpload.single("profilePicture");

exports.getProfilePicture = catchAsync(async (req, res, next) => {
  const fileKey = req.user.profilePicture;

  if (fileKey) {
    const data = (
      await s3
        .getObject({ Key: fileKey, Bucket: process.env.S3_BUCKET_NAME })
        .promise()
    ).Body;
    res.attachment(fileKey);
    res.send(data);
  } else {
    res.sendFile(path.join(__dirname, "defaultProfilePicture.png"));
  }
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // s3.getObject('getObject', { key: req.file.key }, function (err, url) {
  //   console.log(url);
  // });

  // const url = await s3.getSignedUrlPromise('getObject', { Key: req.file.key, Bucket: process.env.S3_BUCKET_NAME });
  // console.log(url)

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm || req.body.email) {
    return next(
      new AppError("This route is not for email/password updates.", 400)
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  let filteredBody = filterObj(req.body, "name", "showWelcome", "language");

  if (req.file) filteredBody.profilePicture = req?.file?.transforms?.[0]?.key;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.dismissNotification = catchAsync(async (req, res, next) => {
  // Remove from embedded Notification Array
  await User.findByIdAndUpdate(req.user._id, {
    $pull: {
      notifications: {
        _id: mongoose.Types.ObjectId(req.params.notificationId),
        permanent: { $ne: true },
      },
    },
  });

  res.status(200).json({
    status: "success",
    // internalStatusCode:
  });
});

exports.addNotification = catchAsync(async (req, res, next) => {
  console.log("adding notification function");
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        notifications: {
          ...req.body,
        },
      },
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    // internalStatusCode:
  });
});

exports.createInvoice = catchAsync(async (req, res, next) => {
  // now about invoice information we will get the informations from client side via req

  // here we have collected the invoice information which will be created
  const { _id, products, totalPrice } = req.user;
});
