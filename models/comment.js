var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    comment: String,
    createdAt: {
        type: Date,
         default: new Date()
    },
    author: {
        // id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Editor"
        // },
        email: String,
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);