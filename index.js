const express = require("express");
const bodyParser = require("body-parser");
const compareTwoConversations = require("./scripts/compareTwoConversations");
const jaccardSimilarity = require("./scripts/jaccardSimilarity");
const findClosestCosineSimilarity = require("./scripts/findClosestCosineSimilarity");
const pool = require("./db");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
const port = 3007;
pool.connect();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.post("/many-conversations", async (req, res) => {
  const { primaryConversation, conversations } = req.body;
  const parsedConversations = JSON.parse(conversations);

  if (parsedConversations.length) {
    res.render("many-conversations", {
      mostSimilar: "N/A",
      cosineSimilarity: "N/A",
      primaryConversation,
      conversations: [],
      error: "Please enter at least two conversations.",
    });
    return;
  }

  const { closestConversation, closestCosineSimilarity, error } =
    await findClosestCosineSimilarity(primaryConversation, parsedConversations);

  res.render("many-conversations", {
    mostSimilar: closestConversation,
    cosineSimilarity: closestCosineSimilarity,
    primaryConversation,
    conversations: parsedConversations,
    error,
  });
});

app.post("/compare-two", async (req, res) => {
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

app.get("/many-conversations", (_req, res) => {
  res.render("many-conversations", {
    mostSimilar: null,
    cosineSimilarity: null,
    primaryConversation: null,
    conversations: [],
    error: null,
  });
});

app.get("/", (_req, res) => {
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
