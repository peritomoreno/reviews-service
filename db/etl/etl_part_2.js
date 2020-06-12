const {
  aggregateRatings,
  aggregateRecommended,
  aggregateCharacteristics
} = require("../metaTransformHelpers.js");
const { Reviews, ReviewsMeta } = require("../db.js");

async function ETL2() {
  let start = new Date();
  let tempArr = [];
  let done = false;
  let product_id;
  var productIdArray = await Reviews.distinctAsync("product");
  while (productIdArray.length > 0) {
    product_id = productIdArray.pop();
    if (productIdArray.length === 0) {
      done = true;
    }
    // find all reviews with this ID
    var reviewsArray = await Reviews.findAsync(
      { product: product_id },
      { characteristics: 1, product: 1, rating: 1, recommend: 1 }
    );
    let metaData = {
      product: product_id,
      ratings: aggregateRatings(reviewsArray),
      recommended: aggregateRecommended(reviewsArray),
      characteristics: aggregateCharacteristics(reviewsArray),
    };
    tempArr.push(metaData);
    if (tempArr.length === 750 || done === true) {
      await ReviewsMeta.createAsync(tempArr);
      tempArr = [];
      if (done) {
        let end = new Date();
        console.log("Start: ", start.toLocaleString());
        console.log("End: ", end.toLocaleString());
      }
    }
  }
}

ETL2();