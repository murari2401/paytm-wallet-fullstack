const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./connection");
const app = express();
require("dotenv").config();
const mainRouter = require("./routes/index").router;

app.use(cors());
app.use(express.json());

connectToDB(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/v1", mainRouter);


app.listen(3000, () => {
  console.log("RUNNING");
});
