var express = require("express"),
router = express.Router(),
Article = require("../models/article"),
Comment = require("../models/comment"),
multer = require("multer");

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only .jpg, jpeg, png and gif file types are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'immaculata-mary', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//index article routes
router.get("/", async (req,res) => {
    try {
        let allArticles = await Article.find({}).sort({createdAt: 'desc'});
        res.render("articles/index", { articles: allArticles, page: "Articles"})
    } catch (e) {
        console.log(e.message)
        res.redirect("back");
    }
});

// new article route
router.get("/new", function(req,res){
    res.render("articles/new", { article: new Article() });
});

// add new post to db
router.post("/", upload.single('image'),  (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect("new"));

// router.post("/", upload.single("image"), async (req, res)=>{
//     try {
//         var result = await cloudinary.uploader.upload(req.file.pathe);
//         // add cloudinary url for the image to the campground object under image property
//         article.image = result.secure_url;
//         // add image's public_id to campground object
//         article.imageId = result.public_id;
//         article.title = req.body.title;
//         article.caption = req.body.caption;
//         article.content = req.body.content;
//     } catch (e) {
//         console.log(e.message);
//         //res.redirect("back");
//         res.render("articles/" + path, {article: article});
//     }
// })
// Show article route
router.get("/:slug", async (req, res) => {
    // try {
    //     const article = await Article.findOne({slug: req.params.slug}).populate("comments").sort({createdAt: 'desc'});
    //     const comment = {username: "", email: "", comment: ""}
    //     res.render("articles/show", { article: article, comment: comment });
    // } catch (e) {
    //     console.log(e.message);
    //     res.redirect("back");
    // }
    
    //Find the article with provided ID
    Article.findOne({ slug: req.params.slug }).populate('comments').exec(function(err, foundArticle){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            //console.log(foundArticle);
            comment = {
                username: "",
                email: "",
                comment: ""
            }
            res.render("articles/show", {article: foundArticle, comment: comment});
        }
    });
});

// edit article route
router.get("/:id/edit", async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render("articles/edit", { article: article });
});

// Update article
router.put("/:id",upload.single('image'), async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect("edit"));

// destroy/delete an article
router.delete("/:id", async (req, res) => {
    await Article.findById(req.params.id, async (err, article) => {
        if(err){
            console.log(e.message);
            return res.redirect("/article");
        }
        try {
            await cloudinary.uploader.destroy(article.imageId);
            article.remove();
            res.redirect("/articles");
        } catch (e) {
            console.log(e.message);
            res.redirect("/articles");
        }
    });
});

function saveArticleAndRedirect(path){
    return async (req, res) => {
        var article = req.article;
        if( path == "edit" && req.file){
           await cloudinary.uploader.destroy(article.imageId);
        }
        try {
            var result = await cloudinary.uploader.upload(req.file.pathe);
            // add cloudinary url for the image to the campground object under image property
            article.image = result.secure_url;
            // add image's public_id to campground object
            article.imageId = result.public_id;
            article.title = req.body.title;
            article.caption = req.body.caption;
            article.content = req.body.content;
        } catch (e) {
            console.log(e.message);
            //res.redirect("back");
            res.render("articles/" + path, {article: article});
        }
        
        console.log(article);
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
