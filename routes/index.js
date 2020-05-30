var express = require("express");
var router = express.Router();

// root route
router.get("/", function(req,res){
    res.render("landing", {page: 'home'});
});

router.get("/about", function(req,res){
    res.send("This will be about page!");
});

router.get("/contact", function(req, res){
    res.render("contact", {page: 'contact'});
    // res.send("This will be contact page");
});

module.exports = router;