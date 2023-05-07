const express = require("express");
const bodyParser = require("body-parser");
const compareTwoConversations = require("./scripts/compareTwoConversations");
const jaccardSimilarity = require("./scripts/jaccardSimilarity");
const pool = require("./db");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
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

  const jaccard = jaccardSimilarity(conversation1, conversation2);

  res.render("home", {
    conversation1,
    conversation2,
    distance,
    cosineSimilarity,
    jaccard,
    error,
  });
});

app.get("/", (req, res) => {
  res.render("home", {
    distance: null,
    cosineSimilarity: null,
    conversation1: null,
    conversation2: null,
    jaccard: null,
    error: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
