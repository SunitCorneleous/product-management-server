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
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    //get specific product by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await productsCollection.findOne(query);

      res.send(result);
    });

    // add products to database
    app.post("/products", async (req, res) => {
      const product = req.body;

      const result = await productsCollection.insertOne(product);

      res.send(result);
    });

    // update product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };

      const product = req.body;
      const updatedDoc = {
        $set: product,
      };

      const result = await productsCollection.updateOne(
        query,
        updatedDoc,
        options
      );

      console.log(result);
      res.send(result);
    });

    // delete a product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: ObjectId(id),
      };

      const result = await productsCollection.deleteOne(query);
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
