var express = require("express");
const { Reviews, ReviewsMeta } = require("../db/db.js");
const {
  RatingQuery,
  RecommendedQuery,
  CharacteristicsQuery,
  ETLAddPhotos,
} = require("../db/db.aggregation.js");
const { formatMetaCharacteristics } = require("./formatMetaCharacteristics.js");
const { exampleReview } = require("../db/example.js");

// create express router
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/reviews/PhotoLoad", (req, res) => {
  Reviews.aggregateAsync(ETLAddPhotos());
  res.send("Working on initial load!");
});

router.get("/reviews/:product_id", (req, res) => {
  Reviews.createAsync(exampleReview);
  let { product_id } = req.params;
  product_id = Number(product_id);
  res.send("Hello New Review Submission!");

  let metaData = { product: product_id };

  Reviews.aggregateAsync(RatingQuery(product_id))
    .then((results) => {
      let ratingData = {};
      // O(1) Time Complexity (max 6 objects to loop through)
      for (let rating of results) {
        ratingData[rating._id] = rating.count;
      }
      metaData.ratings = ratingData;
      return Reviews.aggregateAsync(RecommendedQuery(product_id));
    })
    .then((results) => {
      let recoData = {};
      for (let recommended of results) {
        recoData[recommended._id] = recommended.count;
      }
      // O(1) Time Complexity (max 6 objects to loop through)
      metaData.recommended = recoData;
      return Reviews.aggregateAsync(CharacteristicsQuery(product_id));
    })
    .then((results) => {
      resultsObj = results[0];
      // O(1) Time Complexity (max 6 objects to loop through)
      let charData = formatMetaCharacteristics(resultsObj);
      metaData.characteristics = charData;
      // Find one and update meta-data document / create new meta-data document
      ReviewsMeta.findOneAndUpdate({ product: product_id }, metaData, {
        upsert: true,
      });
    })
    .catch((err) => {
      console.log("err: ", err);
      res.sendStatus(500);
    });
});

module.exports = router;
