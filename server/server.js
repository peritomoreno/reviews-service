const express = require("express");
const { Reviews, ReviewsMeta } = require("../db/db.js");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  Reviews.create({"product_id": 4});
  res.send("Hello World!");
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
