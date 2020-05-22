var express = require("express");
var router = express.Router({mergeParams: true});
var Article = require("../models/article");
var Comment = require("../models/comment");
var middleware = require("../middleware/middleware"); //("../middleware/index.js");
// var middleware = require("../middleware"); //("../middleware/index.js");

// Add a new comment to an article
router.post("/", function(req, res) {
    console.log(req.body);
    Article.findOne({slug: req.params.articleSlug}, function(err, article){
        if(err){
            console.log(err);
            redirect("/articles/" + req.params.slug);
        } else {
            //Create new comment
            Comment.create(req.body, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //save comment
                    comment.save();
                    // connect new comment to article
                    article.comments.push(comment);
                    article.save();
                    //console.log(article);
                    //redirect to article show page
                    res.redirect("/articles/" + article.slug);
                }
            });  
        }
    })
 });

// edit comment route
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {article_id: req.params.id, comment: foundComment});
        }
    })
    
});

// Update comment
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, upatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/articles/" + req.params.id);
        }
    } )
});

// delete comment route
router.delete("/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/articles/" + req.params.id);
        }
    });
});

module.exports = router;