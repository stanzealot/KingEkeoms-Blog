var express = require("express");
var router = express.Router({mergeParams: true});
var Article = require("../models/article");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //("../middleware/index.js");

// Comments new
// router.get("/new", middleware.isLoggedIn, function(req, res){
//     // find campground by id
//     Campground.findById(req.params.id, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             res.render("comments/new", {campground: campground});
//         }
//     });
  
// });

// //Comments create
// router.post("/", middleware.isLoggedIn, function(req,res){
//     //lookup campground using ID
//     Campground.findById(req.params.id, function(err, campground){
//         if(err){
//             console.log(err);
//             redirect("/campgrounds");
//         } else {
//             Comment.create(req.body.comment, function(err, comment){
//                 if(err){
//                     req.flash("Something went wrong");
//                     console.log(err);
//                 } else {
//                     // add username and id to comment
//                    comment.author.id = req.user._id;
//                    comment.author.username = req.user.username;
//                     //save comment
//                     comment.save();
//                     campground.comments.push(comment);
//                     campground.save();
//                     req.flash("success", "Succesfully added comment");
//                     res.redirect("/campgrounds/" + campground._id);
//                 }
//             });
//              //Create new comment
//             // connect new comment to campground
//             //redirect campground show page
//         }
//     })
   
// });

// Add a new comment to an article
router.post("/", function(res, req) {
    Article.findById(req.params.id, function(err, article){
        if(err){
            console.log(err);
            redirect("/articles/" + req.params.slug);
        } else {
            //Create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //save comment
                    comment.save();
                    // connect new comment to article
                    article.comments.push(comment);
                    article.save();
                    console.log(article);
                    //redirect to article show page
                    res.redirect("article/" + article.slug);
                }
            });  
        }
    })
 });

// edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
    
});

// Update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, upatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    } )
});

// delete comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;