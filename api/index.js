require("dotenv").config();
const express = require("express");

const { google } = require("googleapis");
const apikey = process.env.APIKEY;
const customsearch = google.customsearch("v1");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => res.send("Hello Express!"));

app.get("/search", async (req, res) => {
  const search = req.query.q;
  const offset = req.query.offset;

  const results = await customsearch.cse.list({
    cx: "008245539995824095644:3f27vg6irlc",
    q: search,
    auth: apikey,
    searchType: "image",
    start: offset,
  });

  const searchList = results.data.items;
  const displayItems = searchList.map((item) => {
    let itemDetails = {
      id: uuidv4(),
      url: item.link,
      original: item.link,
      snippet: item.snippet,
      thumbnail: item.image.thumbnailLink,
      context: item.image.contextLink,
    };
    return itemDetails;
  });
  res.json({ items: displayItems });
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT,
    );
  else console.log("Error occurred, server can't start", error);
});

module.export = app;
