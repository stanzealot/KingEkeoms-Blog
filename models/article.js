var mongoose = require("mongoose"),
 marked = require("marked"),
 slugify = require("slugify"),
 createDomPurify = require("dompurify"),
 { JSDOM } = require("jsdom"),
 dompurify = createDomPurify(new JSDOM().window);

var articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    caption: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    displayDate: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    },
    // author: {
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Writer"
    //     },
    //     username: String
    // },
   comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

articleSchema.pre("validate", function(next){
    if(this.title){
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    if(this.caption){
        this.sanitizedCaption = dompurify.sanitize(marked(this.caption));
    }

    if(this.content){
        this.sanitizedHtml = dompurify.sanitize(marked(this.content));
    }

    if(this.createdAt){
        this.displayDate = calcDisplayDate(this.createdAt, this.displayDate);
    }
    next();
});

function calcDisplayDate(createdAt, displayDate){
    var day, month, year;
    day = createdAt.getDate();
    month = createdAt.getMonth();
    if(month == 1) month = "January"
    if(month == 2) month = "February"
    if(month == 3) month = "March"
    if(month == 4) month = "April"
    if(month == 5) month = "May"
    if(month == 6) month = "June"
    if(month == 7) month = "July"
    if(month == 8) month = "August"
    if(month == 9) month = "September"
    if(month == 10) month = "October"
    if(month == 11) month = "November"
    if(month == 12) month = "December"
    year = createdAt.getFullYear();
    displayDate = month + " " + day + ", " + year;

    return displayDate;
}
module.exports = mongoose.model("Article", articleSchema);