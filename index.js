const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;
console.log(process.env.DB_PASS);
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wirvw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookCollection = client.db("bookShop").collection("books");

  // perform actions on the collection object

  app.get("/books", (req, res) => {
    bookCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/book/:id", (req, res) => {
    bookCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, item) => {
        res.send(item[0]);
      });
  });

  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    console.log("adding Book", newBook);
    bookCollection.insertOne(newBook).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/deleteBook/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log("delete this", id);
    bookCollection
      .deleteOne({ _id: id })
      .then((documents) => console.log(documents));
  });

  // console.log("database connect");
  // console.log(err)
  //   client.close();
});

const uri1 = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wirvw.mongodb.net/bookShopCheckOut?retryWrites=true&w=majority`;
const client1 = new MongoClient(uri1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client1.connect((err) => {
  const checkOutCollection = client1
    .db("bookShopCheckOut")
    .collection("addCheckOut");
  // perform actions on the collection object
  app.post("/addCheckOut", (req, res) => {
    const newCheckOut = req.body;
    console.log("adding Book", newCheckOut);
    checkOutCollection.insertOne(newCheckOut).then((result) => {
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });

  app.get("/checkOutOrder", (req, res) => {
    checkOutCollection.find({ email: req.query.email }).toArray((err, item) => {
      res.send(item[0]);
    });
  });

  // client.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
