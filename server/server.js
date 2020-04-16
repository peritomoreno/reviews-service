const express = require("express");
const cors = require("cors");
const router = require("./router.js");
const bodyParser = require("body-parser");
const app = express();
const port = 3017;

// const whitelist = ["http://localhost:3000", "http://localhost:3017", "https://loader.io"]
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.use(cors(corsOptions));
app.use(cors());

app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () =>
  console.log(`Review Service Server listening at http://localhost:${port}`)
);
