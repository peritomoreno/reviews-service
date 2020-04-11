const characteristicsTransform = require("./characteristicsTransformHelper.js");

const formatNewReview = (req) => {
  let { product_id } = req.params;
  let {
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics,
  } = req.body;
  // CHG TO REQ.BODY transformation of data before creating the review
  let review = {
    product: Number(product_id),
    rating: rating,
    summary: summary,
    body: body,
    recommend: Boolean(recommend),
    response: "",
    date: new Date(),
    reviewer_name: name,
    reviewer_email: email,
    helpfulness: 0,
    reported: false,
    photos: photos.map((photo, idx) => {
      return { id: idx + 1, url: photo };
    }),
    characteristics: characteristicsTransform(characteristics),
  };
  return review;
};

module.exports = formatNewReview;
