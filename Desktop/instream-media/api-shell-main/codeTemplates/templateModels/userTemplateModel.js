const mongoose = require('mongoose');



const userTemplateSchema = new mongoose.Schema({
    profilePicture: String,
});


module.exports = userTemplateSchema;