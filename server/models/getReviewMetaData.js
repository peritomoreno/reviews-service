const { getAsync, setAsync, expAsync } = require("../../db/redis.js");
const { ReviewsMeta, Characteristics } = require("../../db/db.js");
const formatEmptyResponse = require("../formatEmptyResponse.js");

module.exports = (req, res) => {
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
};
