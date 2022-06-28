const Log = require('./logModel')

/**
 * Basic Log Triggers:
 * LOGIN,
 * LOGOUT,
 * CHANGED PASSWORD,
 * RESET PASSWORD,
 * ENABLED 2FA,
 * DISABLED 2FA,
 * CONFIRMED EMAIL,
 * CHANGED EMAIL, TODO
 * CREATED TEAM,
 * JOINED TEAM,
 * LEFT TEAM,
 * 
 * Log Types:
 * authentication
 * team
 */

exports.createLogEntry = async (logCode, logData, users, team) => {
    const logObj = {
        code: logCode,
        data: logData,
    }
    if (users) logObj.users = users;
    // Only adds Team attribute if teamId is provided
    if (team) logObj.team = team;

    const log = await Log.create(logObj);

    return log;
}