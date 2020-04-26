const { Reviews} = require("../../db/db.js");
const updateCache = require("../updateCache.js");

module.exports = (req, res) => {
  let { review_id } = req.params;
  Reviews.findOneAndUpdateAsync(
    { _id: review_id },
    { $inc: { helpfulness: 1 } }
  )
    .then(({ product }) => {
      res.sendStatus(204);
      updateCache(product);
    })
    .catch((err) => {
      console.log(`ERROR updating helpfulness on review ${review_id}: `, err);
      res.sendStatus(500);
    });
};
