const axios = require("axios");
const url = "http://localhost:3017/reviews/4440/list";

describe("GET Reviews List", () => {
  it("Should return the correct number of results requested", async () => {
    let count = 4,
      page = 1,
      sort = "helpful";

    await axios
      .get(`${url}?count=${count}&page=${page}&sort=${sort}`)
      .then(({ data }) => {
        expect(data.results.length).toBe(4);
      })
      .catch((err) => console.log("err in reviews list test: ", err));
  });

  it("Should correctly sort results by helpfulness", async () => {
    let count = 10,
      page = 1,
      sort = "helpful";

    await axios
      .get(`${url}?count=${count}&page=${page}&sort=${sort}`)
      .then(({ data }) => {
        expect(data.results[0].review_id).toBe(25563);
      })
      .catch((err) => console.log("err in reviews list test: ", err));
  });

  it("Should correctly sort results by recency", async () => {
    let count = 10,
      page = 1,
      sort = "newest";

    await axios
      .get(`${url}?count=${count}&page=${page}&sort=${sort}`)
      .then(({ data }) => {
        expect(data.results[0].review_id).toBe(25555);
      })
      .catch((err) => console.log("err in reviews list test: ", err));
  });

  it("Should correctly sort results by relevancy", async () => {
    let count = 10,
      page = 1,
      sort = "relevancy";

    await axios
      .get(`${url}?count=${count}&page=${page}&sort=${sort}`)
      .then(({ data }) => {
        expect(data.results[0].review_id).toBe(25563);
      })
      .catch((err) => console.log("err in reviews list test: ", err));
  });

  it("Should correctly format the photos data", async () => {
    let count = 10,
      page = 1,
      sort = "relevancy";

    await axios
      .get(`${url}?count=${count}&page=${page}&sort=${sort}`)
      .then(({ data }) => {
        let photo = data.results[0].photos[0];
        expect(photo.hasOwnProperty("id")).toBeTruthy();
        expect(photo.hasOwnProperty("url")).toBeTruthy();
      })
      .catch((err) => console.log("err in reviews list test: ", err));
  });
});
