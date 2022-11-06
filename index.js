const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// home route
app.get("/", (req, res) => {
  res.send(`<h1>Product management server is running 🚀</h1>`);
});

// mongodb config
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jjvalws.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const productsCollection = client
    .db("productManagement")
    .collection("products");
  try {
    // get products
    app.get("/products", async (req, res) => {
      const query = {};

      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // add products to database
    app.post("/products", async (req, res) => {
      const product = req.body;

      const result = await productsCollection.insertOne(product);

      res.send(result);
    });
  } finally {
    //
  }
}

run().catch(err => {
  console.err(`ERROR: ${err}`);
});

// set server port
app.listen(port, () => {
  console.log(`server is running at port: ${port}`);
});
