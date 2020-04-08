const express = require("express");
const { Reviews, ReviewsMeta } = require("../db/db.js");
const { RatingQuery } = require("../db/db.aggregation.js");
const app = express();
const port = 3000;

var exampleReview = {
  product: 3,
  rating: 2,
  summary: "I'm enjoying wearing these shades",
  body: "Comfortable and practical.",
  recommend: 1,
  response: "",
  date: new Date(),
  reviewer_name: "shortandsweeet",
  reviewer_email: "google@gmail.com",
  helpfulness: 34,
  reported: 0,
  photos: [
    {
      id: 1,
      url:
        "https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80",
    },
    {
      id: 2,
      url:
        "https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80",
    },
    {
      id: 3,
      url:
        "https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
    },
  ],
};

app.get("/", (req, res) => {
  // Reviews.create(exampleReview);
  Reviews.aggregateAsync(RatingQuery).then((results) => {
    let data = {};
    for (let rating of results) {
      data[rating._id] = rating.count;
    }
    console.log("results of aggregate: ", {ratings: data});
  });
  res.send("Hello World!");
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
