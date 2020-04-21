const { Reviews } = require("../../db/db.js");
const { upsertMetaData } = require("../../db/metaTransformHelpers.js");
const updateCache = require("../updateCache.js");
const formatNewReview = require("../../db/formatReview.js");

module.exports = (req, res) => {
  let { product_id } = req.params;
  let newReview = formatNewReview(req);
  Reviews.createAsync(newReview)
    .then((result) => {
      // Send Required Response To Client
      res.send(201);
      // Update Meta Data For That Product
      upsertMetaData(product_id);
      updateCache(product_id);
    })
    .catch((err) => {
      res.send(500);
      console.log("err: ", err);
    });
};
