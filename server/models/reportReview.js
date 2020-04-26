const { Reviews } = require("../../db/db.js");
const { upsertMetaData } = require("../../db/metaTransformHelpers.js");
const updateCache = require("../updateCache.js");

module.exports = (req, res) => {
  let { review_id } = req.params;
  Reviews.findOneAndUpdateAsync(
    { _id: review_id },
    { reported: true },
    { new: true }
  )
    .then((updated) => {
      let { product } = updated;
      // update the meta data document for the product to remove the review's influence
      res.sendStatus(204);
      upsertMetaData(product);
      updateCache(product);
    })
    .catch((err) => {
      console.log(
        `ERROR updating reported status on review ${review_id}: `,
        err
      );
      res.sendStatus(500);
    });
};
