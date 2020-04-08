/* ******************* */
/* ***** MONGOOSE **** */
/* ******************* */

var Promise = require("bluebird");
var mongoose = Promise.promisifyAll(require("mongoose"));
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect("mongodb://localhost/apiTest", { useNewUrlParser: true });

var db = mongoose.connection;

autoIncrement.initialize(db);


/* ******************* */
/* ***REVIEWS MODEL*** */
/* ******************* */

var reviewsSchema = new mongoose.Schema({
    // id: #id will be added automatically on each new review
    product_id: Number,
    rating: Number,
    summary: String,
    recommend: Boolean,
    response: String,
    body: String,
    date: String,
    name: String,
    email: String,
    helpfulness: Number,
    reported: Boolean,
    photos: [Object]

})

reviewsSchema.plugin(autoIncrement.plugin, 'Reviews')

var Reviews = db.model('Reviews', reviewsSchema);

/* ******************* */
/* *****META MODEL**** */
/* ******************* */

var reviewsMetaSchema = new mongoose.Schema({
    product_id: Number,
    ratings: Object,
    recommended: Object,
    characteristics: Object
})

// reviewsMetaSchema.plugin(autoIncrement.plugin, 'ReviewsMeta')

var ReviewsMeta = db.model('ReviewsMeta', reviewsMetaSchema);

/* ******************* */
/* ***** EXPORTS ***** */
/* ******************* */
 
module.exports.Reviews = Reviews;
module.exports.ReviewsMeta = ReviewsMeta;