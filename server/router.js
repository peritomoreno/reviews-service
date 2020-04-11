var express = require("express");
const { Reviews, ReviewsMeta } = require("../db/db.js");
const { upsertMetaData } = require("../db/metaTransformHelpers.js");
const { exampleReview } = require("../db/example.js");
const formatNewReview = require("../db/formatReview.js");

// create express router
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// Posting Review Route
router.post("/reviews/:product_id", (req, res) => {
  let { product_id } = req.params;
  let newReview = formatNewReview(req);
  Reviews.createAsync(newReview)
    .then((result) => {
      console.log("result of creating async: ", result);
      // Send Required Response To Client
      res.send(201);
      // Update Meta Data For That Product
      upsertMetaData(product_id);
    })
    .catch((err) => {
      res.send(500);
      console.log("err: ", err);
    });
});

module.exports = router;
