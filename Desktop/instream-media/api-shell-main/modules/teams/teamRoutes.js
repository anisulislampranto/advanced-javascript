const express = require('express');
const teamController = require('./teamController');
const authController = require('./../../controllers/authController');
const invitationRouter = require('./invitationRoutes')
const passport = require('passport');

const router = express.Router();

// Protect all routes after this middleware
router.use(passport.authenticate('jwt', { session: false, failWithError: true }), authController.connectCurrentTeam, authController.restrict());

router.get('/current', teamController.getCurrent, teamController.getTeam);


router.patch('/removeUser', teamController.removeFromTeam);
router.post('/switch', teamController.switchTeam);
router.post('/', teamController.createTeam);


module.exports = router;
