var express = require("express");
var router = express.Router({mergeParams: true});
var Article = require("../models/article");
var Comment = require("../models/comment");
var middleware = require("../middleware/middleware"); 

// Add a new comment to an article
router.post("/", function(req, res) {
    req.comment = new Comment();
    //console.log(req.comment);
    Article.findOne({slug: req.params.articleSlug}, async (err, article) =>{
        if(err){
            console.log(err);
            redirect("/articles/" + req.params.slug);
        } else {
            //Create new comment
            let comment = req.comment;
            comment.username = req.body.username;
            comment.email = req.body.email;
            comment.comment = req.body.comment;
            try {
                //save comment
                    comment = await comment.save();
                    // console.log(comment);
                    //save comment to article
                    article.comments.push(comment);
                    article.save();
                    // redirect to show page
                    res.redirect("/articles/" + article.slug);
            } catch (e) {
                console.log(e);
                res.render("articles/" + article.slug, {comment: comment});
            }         
        }
    });
});

// edit comment route
router.get("/:comment_id/edit", function(req, res){
    Article.findOne({slug: req.params.articleSlug}).populate('comments').exec((err, foundArticle) => {
        if(err){
            console.log(err);
        } else{
            foundArticle.comments.forEach(function(comment){
                console.log(comment);
                if(comment.id == req.params.comment_id){
                    res.render("articles/show", { article: foundArticle, comment: comment } );
                }
            });
            // try {
            //     let comment = Comment.findById(req.params.comment_id);
            //     console.log(comment);
            //     res.render("articles/show", { article: foundArticle, comment: comment } );
            // } catch (e) {
            //     console.log(e.message);
            // });  
        }
    });  
});

// Update comment
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, upatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/articles/" + req.params.articleSlug);
        }
    });
});

// delete comment route
router.delete("/:comment_id", async (req, res) =>{
    try {
        await Comment.findByIdAndDelete(req.params.comment_id);
        res.redirect("/articles/" + req.params.articleSlug);
    } catch (error) {
        console.log(e);
        res.redirect("/articles/" + req.params.articleSlug);
    }
});

function saveCommentAndRedirect(path, article){
    return async (req, res) => {
        let comment = req.comment;
            comment.username = req.body.username;
            comment.email = req.body.email;
            comment.comment = req.body.comment;
       try {
           //save comment
            comment = await comment.save();
            //save comment to article
            article.comments.push(comment);
            res.redirect("/articles/" + article.slug);
       } catch (e) {
           console.log(e);
            res.render("articles/" + path, {article: article});
       }
    }
}

module.exports = router;