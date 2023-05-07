const express = require("express");
const bodyParser = require("body-parser");
const parseInputs = require("./scripts/parseInputs");
const tokenizedParagraph = require("./scripts/tokenizeParagraph");
const discreteCosineTransform = require("./scripts/discreteCosineTransform");
const calculateConversationEuclideanDistance = require("./scripts/calculateConversationEuclideanDistance");
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
  const result = await parseInputs(conversation1, conversation2);
  const tokenizedConversationArray1 = await tokenizedParagraph(conversation1);
  const tokenizedConversationArray2 = await tokenizedParagraph(conversation2);
  const transformedArr1 = discreteCosineTransform(tokenizedConversationArray1);
  const transformedArr2 = discreteCosineTransform(tokenizedConversationArray2);
  const euclideanDistance = await calculateConversationEuclideanDistance(
    conversation1,
    conversation2
  );
  console.log(result);
  res.render("home", {
    result,
    tokenizedConversationArray1: `[ ${tokenizedConversationArray1.join(
      ", "
    )} ]`,
    tokenizedConversationArray2: `[ ${tokenizedConversationArray2.join(
      ", "
    )} ]`,
    transformedArr1: `[ ${transformedArr1.join(", ")} ]`,
    transformedArr2: `[ ${transformedArr2.join(", ")} ]`,
    euclideanDistance,
    conversation1,
    conversation2,
  });
});

app.get("/", (req, res) => {
  res.render("home", {
    result: null,
    euclideanDistance: null,
    tokenizedConversationArray1: null,
    tokenizedConversationArray2: null,
    transformedArr1: null,
    transformedArr2: null,
    conversation1: null,
    conversation2: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
