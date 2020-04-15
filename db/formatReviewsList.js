const formatReviewsList = (product, data, count, page) => {
    let output = {};
    output.count = count;
    output.page = page;
    output.product = Number(product);
    output.results = data.map(review => {
        let formatted = {};
        formatted["review_id"] = review._id;
        formatted.rating = review.rating;
        formatted.summary = review.summary;
        formatted.recommend = review.recommend;
        formatted.response = review.response;
        formatted.body = review.body;
        formatted.date = review.date;
        formatted.reviewer_name = review.reviewer_name;
        formatted.helpfulness = review.helpfulness;
        formatted.photos = review.photos;
        return formatted;
    })
    return output;
}

module.exports = formatReviewsList;