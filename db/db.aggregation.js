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

// module.exports.ETLAddPhotos = () => {
//   return [
//     {
//       $lookup: {
//         from: "reviews_photos",
//         localField: "id",
//         foreignField: "review_id",
//         as: "photos",
//       },
//     },
//     {
//       $out: "reviews",
//     },
//   ];
// };

// module.exports.ETLAddCharacteristics = () => {
//   return [
//     {
//       $lookup: {
//         from: "characteristics_combo",
//         localField: "id", // review id
//         foreignField: "review_id",
//         as: "characteristics",
//       },
//     },
//     {
//       $unwind: {
//         path: "$characteristics",
//       },
//     },
//     {
//       $out: "reviews", // "reviews_final"...previously
//     },
//   ];
// };
