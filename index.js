const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { json } = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ieoe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("volunteerNetwork");
    const networkCollection = database.collection("supports");

    // GET API Start
    app.get("/supports", async (req, res) => {
      const cursor = networkCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // GET API End

    // Post API

    app.post("/supports", async (req, res) => {
      const support = req.body;
      const result = await networkCollection.insertOne(support);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// Middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running BK Volunteer Network Server");
});

app.listen(port, () => {
  console.log("Running Bk Volunteer Network Server on Port", port);
});
