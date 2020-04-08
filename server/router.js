var express = require("express");
const { Reviews, ReviewsMeta } = require("../db/db.js");
const { RatingQuery, RecommendedQuery, CharacteristicsQuery } = require("../db/db.aggregation.js");
const { exampleReview } = require("../db/example.js");

// create express router
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/reviews/:product_id", (req, res) => {
  // Reviews.createAsync(exampleReview);

  let { product_id } = req.params;
  product_id = Number(product_id);
  res.send("Hello New Review Submission!");

  let metaData = {"product_id": product_id};

  Reviews.aggregateAsync(RatingQuery(product_id))
    .then((results) => {
      let data = {};
      // O(1) Time Complexity (max 6 objects to loop through)
      for (let rating of results) {
        data[rating._id] = rating.count;
      }
      metaData.ratings = data;
      console.log("results of ratings aggregation: ", metaData);
      return Reviews.aggregateAsync(RecommendedQuery(product_id));
    })
    .then((results) => {
      let data = {};
      for (let recommended of results) {
        data[recommended._id] = recommended.count;
      }
      metaData.recommended = data;
      console.log("results of recommended aggregation: ", metaData);
      return Reviews.aggregateAsync(CharacteristicsQuery(product_id));
    })
    .then(results => {
      console.log("results of characteristics query: ", results)
    })
    .catch((err) => {
      console.log("err: ", err);
      res.sendStatus(500);
    });
});

module.exports = router;
