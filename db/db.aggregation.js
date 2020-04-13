module.exports.RatingQuery = (product_id) => {
  return [
    {
      $match: {
        product: product_id,
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
};

module.exports.RecommendedQuery = (product_id) => {
  return [
    {
      $match: {
        product: product_id,
        recommend: true,
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
};

module.exports.CharacteristicsQuery = (product_id) => {
  return [
    {
      $match: {
        product: product_id,
      },
    },
    {
      $project: {
        characteristics: 1,
      },
    },
    {
      $group: {
        _id: "characteristics",
        Size: {
          $avg: "$characteristics.1",
        },
        Width: {
          $avg: "$characteristics.2",
        },
        Comfort: {
          $avg: "$characteristics.3",
        },
        Quality: {
          $avg: "$characteristics.4",
        },
        Length: {
          $avg: "$characteristics.5",
        },
        Fit: {
          $avg: "$characteristics.6",
        },
      },
    },
  ];
};