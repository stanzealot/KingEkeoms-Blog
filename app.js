var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    methodOverride =require("method-override"),
    indexRoutes = require("./routes/index"),
    commentRoutes = require("./routes/comments"),
    articleRoutes = require('./routes/articles');

var url = "mongodb://steve:skoobybi0la@ds123725.mlab.com:23725/alc";
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connection to the Atlas Cluster is successful')
}).catch((err) => console.error(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.use(indexRoutes);
app.use( "/articles", articleRoutes);
app.use( "/articles/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("King-Ekeoms Server has started!");
});
