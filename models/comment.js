var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    comment: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    email: {
        type: String
    },
    username: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Comment", commentSchema);