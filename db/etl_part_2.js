const {
  aggregateRatings,
  aggregateRecommended,
  aggregateCharacteristics
} = require("./metaTransformHelpers.js");
const { Reviews, ReviewsMeta } = require("./db.js");

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
    if (tempArr.length === 500 || done === true) {
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

/*
function formatNumber(num) {
  return (Math.round(num * 4) / 4).toFixed(2);
}

function aggregateRatings(array) {
  let ratings = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (let review of array) {
    ratings[review.rating]++;
  }
  return ratings;
}

function aggregateRecommended(array) {
  let recommended = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (let review of array) {
    recommended[review.rating] += review.recommend;
  }
  return recommended;
}

function aggregateCharacteristics(resultArray) {
  let results = {};
  for (let review of resultArray) {
    let chars = Object.keys(review.characteristics);
    for (let char of chars) {
      let value = review.characteristics[char];
      if (results[char] === undefined) {
        results[char] = {
          total: value,
          count: 1,
        };
      } else {
        results[char].total += value;
        results[char].count++;
      }
    }
  }
  let finalChars = Object.keys(results);
  let output = {
    Size: { id: 1, value: null },
    Width: { id: 2, value: null },
    Comfort: { id: 3, value: null },
    Quality: { id: 4, value: null },
    Length: { id: 5, value: null },
    Fit: { id: 6, value: null },
  };
  for (let char of finalChars) {
    if (char === "1") {
      output.Size.value = formatNumber(
        results[char].total / results[char].count
      );
    }
    if (char === "2") {
      output.Width.value = formatNumber(
        results[char].total / results[char].count
      );
    }
    if (char === "3") {
      output.Comfort.value = formatNumber(
        results[char].total / results[char].count
      );
    }
    if (char === "4") {
      output.Quality.value = formatNumber(
        results[char].total / results[char].count
      );
    }
    if (char === "5") {
      output.Length.value = formatNumber(
        results[char].total / results[char].count
      );
    }
    if (char === "6") {
      output.Fit.value = formatNumber(
        results[char].total / results[char].count
      );
    }
  }
  return output;
}
*/