const express = require('express');
const invitationController = require('./invitationController');
const authController = require('./../../controllers/authController');
const passport = require('passport');


// Get access to params in team Router
const router = express.Router({ mergeParams: true });

router.get('/:invitationId', invitationController.validateInvitation, invitationController.getInvitation)
// Protect all routes after this middleware
router.use(passport.authenticate('jwt', { session: false, failWithError: true }), authController.connectCurrentTeam, authController.restrict());

router.post('/acceptInvitation', invitationController.validateInvitation, invitationController.acceptInvitation)


// create New Invitation
router.post('/', invitationController.createInvitation);
// Delete Invitation
router.delete('/:invitationId', invitationController.deleteInvitation);

module.exports = router