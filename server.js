const express = require("express");
const mongoose = require("mongoose");

const urlShortener = require("./models/urlShortener");
require("dotenv").config();
const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.set("view engine", "ejs");
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/shortUrls", async (req, res) => {
  await urlShortener.create(
    {
      fullUrl: req.body.url,
    },
    (err, urlShortener) => {
      res.send({
        shortURL: `${process.env.APP_URL}${urlShortener.shortUrl}`,
      });
    }
  );
});

app.get("/:shortURL", async (req, res) => {
  const shortUrl = await urlShortener.findOne({
    shortUrl: req.params.shortURL,
  });

  if (!shortUrl) {
    return res.sendStatus(404);
  }
  let url = shortUrl.fullUrl;
  if (!url.includes("http://") && !url.includes("https://")) {
    url = `http://${url}`;
  }

  res.status(301).redirect(url);
});

app.listen(process.env.PORT || 5000);
