const { delAsync, scanAsync } = require("../db/redis.js");

module.exports = function (product_id) {
  scanAsync("0", "MATCH", `R:${product_id}-*`)
    .then((result) => {
      if (result[1].length > 0) {
        return delAsync(result[1]);
      }
    })
    .catch((err) => console.log("err updating redis cache"));
  delAsync(`meta:${product_id}`).catch((err) => console.log("error deleting meta data: ", err));
};
