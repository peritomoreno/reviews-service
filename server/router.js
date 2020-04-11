var express = require("express");
const { Reviews, ReviewsMeta } = require("../db/db.js");
const { upsertMetaData } = require("../db/metaTransformHelpers.js");
const formatNewReview = require("../db/formatReview.js");

// create express router
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

//***************//
//***** GET *****//
//***************//
router.get("/reviews/:product_id/meta", (req, res) => {
  let { product_id } = req.params;
  ReviewsMeta.findAsync({ product: product_id })
    .then((result) => {
      let data = result[0];
      let metaData = {
        product_id: data.product,
        ratings: data.ratings,
        recommended: data.recommended,
        characteristics: data.characteristics,
      };
      res.send(metaData);
    })
    .catch((err) => {
      console.log("err fetching meta data: ", err);
      res.send(500);
    });
});

router.get("/reviews/:product_id/list", (req, res) => {
  let { product_id } = req.params;
  let { count, page, sort } = req.query;
  
  let filter = { product: product_id, reported: false };
  let options = {}
  let sortBy;
  if (sort === "newest") {
    sortBy = {date: -1}
  } else if (sort === "helpful") {
    sortBy = {helpfulness: -1}
  } else {
    sortBy = {date: -1, helpfulness: -1}
  }

  Reviews.find(filter, null, Object.assign({}, options, sortBy)).then((results) => {
    res.send(results);
  });
});

//***************//
//**** POST *****//
//***************//

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
