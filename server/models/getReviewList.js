const { getAsync, setAsync, expAsync } = require("../../db/redis.js");
const { Reviews } = require("../../db/db.js");
const formatReviewsList = require("../../db/formatReviewsList.js");

module.exports = (req, res) => {
  let { product_id } = req.params;
  let { count, page, sort } = req.query;
  let filter = { product: product_id, reported: false };
  let sortBy = {};
  if (sort === "newest") {
    sortBy = { date: -1 };
  } else if (sort === "helpful") {
    sortBy = { helpfulness: -1 };
  } else {
    sortBy = { helpfulness: -1, date: -1 };
  }
  count = count === undefined ? 5 : Number(count);
  page = page === undefined || page === "0" ? 1 : Number(page);
  let start = count * (page - 1);
  let end = start + count;

  let redisKey = `R:${product_id}-P:${page}-C:${count}-S:${sort}`;

  getAsync(redisKey).then((data) => {
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      Reviews.findAsync(filter, null, { sort: sortBy })
        .then((results) => {
          let data =
            results.length < count ? results : results.slice(start, end);
          let output = formatReviewsList(product_id, data, count, page);
          res.send(output);
          setAsync(redisKey, JSON.stringify(output))
            .then(() => {
              expAsync(redisKey, 1800);
            })
            .catch((err) => {
              console.log("error setting redis cache for review: ", err);
              res.send(500);
            });
        })
        .catch((err) => {
          console.log("error finding reviews list: ", err);
        });
    }
  });
};
