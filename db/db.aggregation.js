module.exports.RatingQuery = [
  {
    $match: {
      product: 2,
    },
  },
  {
    $group: {
      _id: "$rating",
      count: {
        $sum: 1,
      },
    },
  },
];
