const express = require("express");
const router = require("./router.js");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () =>
  console.log(`Review Service Server listening at http://localhost:${port}`)
);
