const express = require("express");
const userController = require("./userController");
const authController = require("../../controllers/authController");
const passport = require("passport");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);

router.get("/confirmEmail/:token", authController.confirmEmail);
router.get(
  "/confirmEmailChange/:token",
  authController.confirmEmailChange1,
  authController.confirmEmailChange2
);

router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
  authController.connectCurrentTeam,
  authController.restrict()
);

// Just protected to get user object for log
router.get("/logout", authController.logout);

router.get("/get2facode", authController.getTwoFACode);
router.post(
  "/enable2fa",
  authController.twoFAProtect,
  authController.enableTwoFA
);
router.post(
  "/disable2fa",
  authController.twoFAProtect,
  authController.disableTwoFA
);

router.patch("/updateMyPassword", authController.updatePassword);
router.patch("/updateMyEmail", authController.updateEmail);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  // userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);
router.get("/profilePicture", userController.getProfilePicture);

// notifications
router.delete(
  "/notifications/:notificationId",
  userController.dismissNotification
);
router.post("/notifications", userController.addNotification);

router.get("/checkAuthentication", authController.checkAuthentication);

// For Meta Admin, separate app needed

// router.use(authController.restrictTo('admin'));

// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
