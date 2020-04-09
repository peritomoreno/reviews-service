const csv = require("csv-parser");
const fs = require("fs");
const { Reviews } = require("./db.js");

var tmpArr = [];
var start = new Date();
console.log("Start at: ", start.toLocaleString());
const rs = fs.createReadStream("etl_data.csv");
  rs.pipe(csv())
  .on("data", (data) => {
    let doc = {};
    let photos = createPhotosArray(data);
    let characteristics = createCharacteristicsObject(data);
    doc.photos = photos;
    doc.characteristics = characteristics;
    // doc.id = Number(data.id);
    doc.product = Number(data.product_id);
    doc.rating = Number(data.rating);
    doc.date = data.date;
    doc.summary = data.summary;
    doc.body = data.body;
    doc.recommend = Boolean(data.recommend);
    doc.reported = Boolean(data.reported);
    doc.reviewer_name = data.reviewer_name;
    doc.reviewer_email = data.reviewer_email;
    doc.response = data.response === "null" || data.response === "NA" ? "" : data.response;
    doc.helpfulness = Number(data.helpfulness);
    // console.log("built up document object: ", doc);
    tmpArr.push(doc);
    if (tmpArr.length === 100) {
      Reviews.createAsync(tmpArr)
        .then(() => rs.resume())
        .catch((err) => { console.log("err loading data: ", err) });
      tmpArr = [];
      rs.pause()
    }
  })
  .on("end", () => {
    var end = new Date();
    console.log("Done at: ", end.toLocaleString());
  });

var createCharacteristicsObject = (data) => {
  var { Fit, Length, Comfort, Quality, Size, Width } = data;
  var chars = {};
  if (Size !== "NA") {
    chars["1"] = Number(Size);
  }
  if (Width !== "NA") {
    chars["2"] = Number(Width);
  }
  if (Comfort !== "NA") {
    chars["3"] = Number(Comfort);
  }
  if (Quality !== "NA") {
    chars["4"] = Number(Quality);
  }
  if (Length !== "NA") {
    chars["5"] = Number(Length);
  }
  if (Fit !== "NA") {
    chars["6"] = Number(Fit);
  }
  return chars;
};

var createPhotosArray = (data) => {
  var { photos_1, photos_2, photos_3 } = data;
  var photos = [];
  if (photos_1 !== "NA") {
    photos.push({ id: 1, url: photos_1 });
  }
  if (photos_2 !== "NA") {
    photos.push({ id: 2, url: photos_2 });
  }
  if (photos_3 !== "NA") {
    photos.push({ id: 3, url: photos_3 });
  }
  return photos;
};
