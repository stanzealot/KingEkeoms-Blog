var express = require("express"),
router = express.Router(),
Article = require("../models/article");
Comment = require("../models/comment");

//index article routes
router.get("/", async (req,res) => {
    await Article.find({}, (err, allArticles) => {
        if(err){
            console.log(err);
        } else {
            res.render("articles/index", { articles: allArticles, page: "Articles"});
        }
    })
});

// new article route
router.get("/new", function(req,res){
    res.render("articles/new", { article: new Article() });
});

// add new post to db
router.post("/", async (req, res, next) => {
    req.article = new Article();
    console.log(req.article);
    next();
}, saveArticleAndRedirect("new"));


// Show article route
router.get("/:slug", function(req, res){
    // const article = await Article.findOne({ slug: req.params.slug }).populate('comments').exec();
    // console.log(article);
    // if(article == null) res.redirect('/');
    // res.render("articles/show", {article: article});
    //Find the article with provided ID
    Article.findOne({ slug: req.params.slug }).populate('comments').exec(function(err, foundArticle){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            console.log(foundArticle);
            res.render("articles/show", {article: foundArticle});
        }
    });
});

// edit article route
router.get("/:id/edit", async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render("articles/edit", { article: article });
});

// Update article
router.put("/:id", async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

// destroy/delete an article
router.delete("/:id", async (req, res) => {
    await  Article.findByIdAndDelete(req.params.id);
    res.redirect('/articles');
});

function saveArticleAndRedirect(path){
    return async (req, res) => {
        let article = req.article;
            article.title = req.body.title;
            article.caption = req.body.caption;
            article.content = req.body.content;
       try {
        article = await article.save();
        res.redirect("/articles/" + article.slug);
       } catch (e) {
           console.log(e);
            res.render("articles/" + path, {article: article});
       }
    }
}

module.exports = router;
