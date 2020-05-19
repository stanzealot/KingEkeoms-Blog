var mongoose = require("mongoose");
var passportLocalMongoose = rquire("passport-local-mongoose");

var editorSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin:{type: Boolean, default: false}
});
editorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Writer", editorSchema);