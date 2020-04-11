// const csv = require("csv-parser");
// const fs = require("fs");
const { Reviews, ReviewsMeta } = require("./db.js");

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

let start = new Date();
Reviews.distinctAsync("product").then((productIdArray) => {
  let tempArr = [];
  let done = false;
  function loadNextMeta() {
    let product_id = productIdArray.pop();
    if (productIdArray.length === 0) {
      done = true;
    }
    // find all reviews with this ID
    Reviews.findAsync(
      { product: product_id },
      { characteristics: 1, product: 1, rating: 1, recommend: 1 }
    ).then((resultArray) => {
      // aggregate rating data
      let ratings = aggregateRatings(resultArray);
      // aggregate recommendation data
      let recommended = aggregateRecommended(resultArray);
      // aggregate characteristic data
      let characteristics = aggregateCharacteristics(resultArray);

      let metaData = {
        product: product_id,
        ratings: ratings,
        recommended: recommended,
        characteristics: characteristics,
      };
      tempArr.push(metaData);
      if (tempArr.length === 200 || done === true) {
        ReviewsMeta.createAsync(tempArr).then(() => {
          tempArr = [];
          if (done) {
            let end = new Date();
            console.log("Start: ", start.toLocaleString());
            console.log("End: ", end.toLocaleString());
            return;
          } else {
            loadNextMeta();
          }
        });
      } else {
        loadNextMeta();
      }
    });
  }
  loadNextMeta();
});

// some sort of set interval
// pop off of productarray a value
// if it is not null
// run this whole process on the data
// if it is null
// clear interval
// tell me I am done.
// look into indexing my data
// Get all of the unique product IDs that need to be loaded
/*
Reviews.distinctAsync("product").then((productIdArray) => {
  // for each product in productIdArray
  let productIdArrayCopy = productIdArray.slice(0, 100);

  function loadNextMeta() {
    let product_id = productIdArrayCopy.pop();
    if (product_id === undefined) {
      var end = new Date();
      console.log("Start: ", start.toLocaleString());
      console.log("End: ", end.toLocaleString());
      return;
    }
    Reviews.aggregateAsync(RatingQuery(product_id))
      .then((results) => {
        var ratingData = {};
        let metaData = { product: product_id };
        // O(1) Time Complexity (max 6 objects to loop through)
        for (let rating of results) {
          ratingData[rating._id] = rating.count;
        }
        metaData.ratings = ratingData;
        return ReviewsMeta.findOneAndUpdate({ product: product_id }, metaData, {
          upsert: true,
        });
      })
      .then((results) => {
        loadNextMeta();
      })
      .catch((err) => {
        console.log("err: ", err);
        res.sendStatus(500);
      });
  }
  var start = new Date();
  loadNextMeta();
});
*/
