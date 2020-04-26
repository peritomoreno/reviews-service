const express = require("express");
const reportReview = require("./models/reportReview.js");
const markReviewHelpful = require("./models/markReviewHelpful.js");
const postReview = require("./models/postReview.js");
const getReviewMetaData = require("./models/getReviewMetaData.js");
const getReviewList = require("./models/getReviewList.js");

// create express router
var router = express.Router();

//***************//
//***** GET *****//
//***************//

// Getting a Review Meta Data
router.get("/reviews/:product_id/meta", (req, res) => {
  getReviewMetaData(req, res);
});

// Getting a Product's List of Reviews
router.get("/reviews/:product_id/list", (req, res) => {
  getReviewList(req, res);
});

router.get("/loaderio-2a616f385cab7958a65750c0d2907b11/", (req, res) => {
  res.send("loaderio-2a616f385cab7958a65750c0d2907b11");
});

//***************//
//**** POST *****//
//***************//

// Posting Review Route
router.post("/reviews/:product_id", (req, res) => {
  postReview(req, res);
});

//***************//
//***** PUT *****//
//***************//

// Updating a review to show it was found helpful
router.put("/reviews/helpful/:review_id", (req, res) => {
  markReviewHelpful(req, res);
});

// Updating a review to show it was reported
router.put("/reviews/report/:review_id", (req, res) => {
  reportReview(req, res);
});

module.exports = router;
