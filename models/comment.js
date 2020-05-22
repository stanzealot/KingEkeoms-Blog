var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    comment: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    email: {
        type: String
    },
    username: {
        type: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);