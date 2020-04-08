var express = require("express");
const { Reviews, ReviewsMeta } = require("../db/db.js");
const { RatingQuery } = require("../db/db.aggregation.js");
const { exampleReview } = require("../db/example.js");

// create express router
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/reviews/:product_id", (req, res) => {
  // Reviews.createAsync(exampleReview).then( => )
  res.send("Hello New Review Submission!");
  Reviews.aggregateAsync(RatingQuery).then((results) => {
    let data = {};
    // O(1) Time Complexity (max 6 objects to loop through)
    for (let rating of results) {
      data[rating._id] = rating.count;
    }
    console.log("results of aggregate: ", { ratings: data });
  });
  
});

module.exports = router;
