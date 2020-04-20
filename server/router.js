const express = require("express");
const { getAsync, setAsync, expAsync } = require("../db/redis.js");
const { Reviews, ReviewsMeta, Characteristics } = require("../db/db.js");
const { upsertMetaData } = require("../db/metaTransformHelpers.js");
const updateCache = require("./updateCache.js");
const formatNewReview = require("../db/formatReview.js");
const formatReviewsList = require("../db/formatReviewsList.js");
const formatEmptyResponse = require("./formatEmptyResponse.js");

// create express router
var router = express.Router();

//***************//
//***** GET *****//
//***************//

// Getting a Review Meta Data
router.get("/reviews/:product_id/meta", (req, res) => {
  let { product_id } = req.params;
  // check redis cache for previous answer
  getAsync(`meta:${product_id}`)
    .then((data) => {
      // if data is not null
      if (data !== null) {
        console.log("cached meta data sent: ", data);
        res.send(JSON.parse(data));
      } else {
        // reroute to do rest of calculations
        ReviewsMeta.findAsync({ product: product_id })
          .then((result) => {
            let data = result[0];
            if (data === undefined) {
              Characteristics.findAsync({ product_id: product_id })
                .then((results) => {
                  // transform characteristics into usable form for reply
                  let emptyData = formatEmptyResponse(results, product_id);
                  res.send(emptyData);
                  return setAsync(
                    `meta:${product_id}`,
                    JSON.stringify(emptyData)
                  );
                })
                .then(() => {
                  expAsync(`meta:${product_id}`, 1800);
                })
                .catch((err) => {
                  console.log("error fetching characteristics: ", err);
                  res.sendStatus(500);
                });
            } else {
              let metaData = {
                product_id: data.product,
                ratings: data.ratings,
                recommended: data.recommended,
                characteristics: data.characteristics,
              };
              res.send(metaData);
              setAsync(`meta:${product_id}`, JSON.stringify(metaData))
                .then(() => {
                  expAsync(`meta:${product_id}`, 1800);
                })
                .catch((err) => {
                  console.log("error setting and expiring redis: ", err);
                  res.sendStatus(500);
                });
            }
          })
          .catch((err) => {
            console.log("err fetching meta data: ", product_id, err);
            res.sendStatus(500);
          });
      }
    })
    .catch((err) => {
      console.log("error attempting to get redis data!");
      res.send(500);
    });
});

// Getting a Product's List of Reviews
router.get("/reviews/:product_id/list", (req, res) => {
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
});

router.get("/loaderio-2a616f385cab7958a65750c0d2907b11/", (req, res) => {
  res.send("loaderio-2a616f385cab7958a65750c0d2907b11");
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
});

//***************//
//***** PUT *****//
//***************//

// Updating a review to show it was found helpful
router.put("/reviews/helpful/:review_id", (req, res) => {
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
});

// Updating a review to show it was reported
router.put("/reviews/report/:review_id", (req, res) => {
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
});

module.exports = router;
