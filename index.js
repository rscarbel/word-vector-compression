const express = require("express");
const bodyParser = require("body-parser");
const compareTwoConversations = require("./scripts/compareTwoConversations");
const pool = require("./db");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
const port = 3000;
pool.connect();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.post("/", async (req, res) => {
  const { conversation1, conversation2 } = req.body;

  const { cosineSimilarity, distance, error } = await compareTwoConversations(
    conversation1,
    conversation2
  );

  res.render("home", {
    conversation1,
    conversation2,
    distance,
    cosineSimilarity,
    error,
  });
});

app.get("/", (req, res) => {
  res.render("home", {
    distance: null,
    cosineSimilarity: null,
    conversation1: null,
    conversation2: null,
    error: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
