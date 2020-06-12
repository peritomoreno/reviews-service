const { Reviews, ReviewsMeta } = require("./db.js");

//********************//
//*** ETL HELPERS ****//
//********************//

const formatNumber = (num) => {
  return (Math.round(num * 4) / 4).toFixed(2);
};

const aggregateRatings = (array) => {
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
};

const aggregateRecommended = (array) => {
  let recommended = {
    0: 0,
    1: 0,
  };
  for (let review of array) {
    if (review.recommend === true) {
      recommended["1"]++;
    } else {
      recommended["0"]++;
    }
  }
  return recommended;
};

const aggregateCharacteristics = (resultArray) => {
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
  let output = {};
  for (let char of finalChars) {
    if (char === "1") {
      output.Size = {
        id: 1,
        value: formatNumber(results[char].total / results[char].count),
      };
    }
    if (char === "2") {
      output.Width = {
        id: 2,
        value: formatNumber(results[char].total / results[char].count),
      };
    }
    if (char === "3") {
      output.Comfort = {
        id: 3,
        value: formatNumber(results[char].total / results[char].count),
      };
    }
    if (char === "4") {
      output.Quality = {
        id: 4,
        value: formatNumber(results[char].total / results[char].count),
      };
    }
    if (char === "5") {
      output.Length = {
        id: 5,
        value: formatNumber(results[char].total / results[char].count),
      };
    }
    if (char === "6") {
      output.Fit = {
        id: 6,
        value: formatNumber(results[char].total / results[char].count),
      };
    }
  }
  return output;
};

module.exports.aggregateRatings = aggregateRatings;
module.exports.aggregateRecommended = aggregateRecommended;
module.exports.aggregateCharacteristics = aggregateCharacteristics;
module.exports.formatNumber = formatNumber;

//********************//
//* Update MetaData **//
//********************//

const upsertMetaData = (id) => {
  // find all reviews with this ID
  Reviews.findAsync(
    { product: id, reported: false },
    { characteristics: 1, product: 1, rating: 1, recommend: 1 }
  )
    .then((reviewsArray) => {
      let metaData = {
        product: id,
        ratings: aggregateRatings(reviewsArray),
        recommended: aggregateRecommended(reviewsArray),
        characteristics: aggregateCharacteristics(reviewsArray),
      };
      return ReviewsMeta.findOneAndUpdateAsync({ product: id }, metaData, {
        upsert: true,
      });
    })
    .then(() => {
      // console.log("result of find one and update meta: ", result);
    })
    .catch((err) =>
      console.log("err trying to find one and update meta: ", err)
    );
};

module.exports.upsertMetaData = upsertMetaData;