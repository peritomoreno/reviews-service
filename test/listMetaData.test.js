const axios = require("axios");
const url = "http://localhost:3017/reviews/4440/meta";

describe("GET Reviews Metadata List", () => {
  it("Should return an object with the correct properties", async () => {
    await axios
      .get(url)
      .then(({ data }) => {
        let properties = [
          "product_id",
          "ratings",
          "recommended",
          "characteristics",
        ];
        for (let property of properties) {
          expect(data.hasOwnProperty(property)).toBeTruthy();
        }
      })
      .catch((err) => console.log("err in reviews metadata list test: ", err));
  });

  it("Should only contain characteristics that pertain to the specific product", async () => {
    await axios
      .get(url)
      .then(({ data }) => {
        let { characteristics } = data;
        let present = ["Comfort", "Quality", "Length", "Fit"];
        let notPresent = ["Size", "Width"];
        for (let item of present) {
          expect(characteristics.hasOwnProperty(item)).toBeTruthy();
        }
        for (let notItem of notPresent) {
          expect(characteristics.hasOwnProperty(notItem)).toBeFalsy();
        }
      })
      .catch((err) => console.log("err in reviews metadata list test: ", err));
  });

  it("Should contain a correctly formatted recommended property", async () => {
    await axios
      .get(url)
      .then(({ data }) => {
        let { recommended } = data;
        expect(recommended.hasOwnProperty("0")).toBeTruthy();
        expect(recommended.hasOwnProperty("1")).toBeTruthy();
      })
      .catch((err) => console.log("err in reviews metadata list test: ", err));
  });
});
