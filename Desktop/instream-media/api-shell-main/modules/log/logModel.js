const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { makeId } = require('../../utils/utilityFunctions');


let logSchemaObject = {

    code: Number, // Log code used to display translations
    data: Object, // Log Data

    users: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
};

// Append Team Attributes if Shell Mode is Team
if (process.env.SHELL_MODE === 'team') {
    logSchemaObject.teams = [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Team'
        }
    ]
}

// Try to import the Team Template Model, and add it to the current Model
try {
    const logTemplateSchema = require('../../../templateModels/logTemplateModel.js');
    logSchemaObject = {
        ...logTemplateSchema.obj,
        ...logSchemaObject
    }
} catch (error) {
    // console.log(error);
    console.log('No Log Template Model found');
}

const LogSchema = new mongoose.Schema(logSchemaObject);



const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
