const express = require("express");
const cors = require("cors");
const router = require("./router.js");
const bodyParser = require("body-parser");
const app = express();
const port = 3017;

app.use(cors());

app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () =>
  console.log(`Review Service Server listening at http://localhost:${port}`)
);
