const JwtStrategy = require('passport-jwt').Strategy
const fs = require('fs');
const path = require('path');
const { cookieExtractor } = require('../utils/utilityFunctions');
const User = require('../modules/users/userModel');

const pathToKey = path.join(__dirname, '..', '..', '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, function (jwt_payload, done) {

        // We will assign the `id` property on the JWT to the database ID of user
        User.findOne({ _id: jwt_payload.id }, function (err, user) {

            // This flow look familiar?  It is the same as when we implemented
            // the `passport-local` strategy
            if (err) {
                // return next(new AppError('JWT Malformed', 401, 401002))
                // return next(
                //     new AppError('You are not logged in! Please log in to get access.', 401, 401000)
                //   );
                return done(err, false);
            }
            if (user) {
                // Check if user recently changed password
                if (user.changedPasswordAfter(jwt_payload.iat)) {
                    // return next(
                    //   new AppError('User recently changed password! Please log in again.', 401, 401007)
                    // );
                    return done(null, false);
                }
                return done(null, user);
            } else {
                // return next(
                //     new AppError(
                //       'The user belonging to this token does no longer exist.',
                //       401, 401001
                //     )
                //   );
                return done(null, false);
            }

        }).populate({
            path: 'teamMemberships',
            strictPopulate: false,
        });

    }));
}