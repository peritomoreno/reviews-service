/* ******************* */
/* ***** MONGOOSE **** */
/* ******************* */

var Promise = require("bluebird");
var mongoose = Promise.promisifyAll(require("mongoose"));
var autoIncrement = require("mongoose-auto-increment");

mongoose.connect("mongodb://localhost/service", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

autoIncrement.initialize(db);

/* ******************* */
/* ***REVIEWS MODEL*** */
/* ******************* */

var reviewsSchema = new mongoose.Schema({
  // id: #id will be added automatically on each new review
  product: Number,
  rating: Number,
  summary: String,
  body: String,
  recommend: Boolean,
  response: String,
  date: String,
  reviewer_name: String,
  reviewer_email: String,
  helpfulness: Number,
  reported: Boolean,
  photos: [Object],
  characteristics: Object
});

reviewsSchema.plugin(autoIncrement.plugin, "Reviews");

var Reviews = db.model("Reviews", reviewsSchema);

/* ******************* */
/* *****META MODEL**** */
/* ******************* */

var reviewsMetaSchema = new mongoose.Schema({
  product: Number,
  ratings: Object,
  recommended: Object,
  characteristics: Object,
});

// reviewsMetaSchema.plugin(autoIncrement.plugin, 'ReviewsMeta')

var ReviewsMeta = db.model("ReviewsMeta", reviewsMetaSchema);

/* ******************* */
/* ***** EXPORTS ***** */
/* ******************* */

module.exports.Reviews = Reviews;
module.exports.ReviewsMeta = ReviewsMeta;
