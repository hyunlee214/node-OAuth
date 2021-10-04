// @ts-check

const { MongoClient } = require("mongodb");

const { MONGO_PASSWORD, MONGO_CLUSTER, MONGO_USER, MONGO_DBNAME } = process.env;

const uri = `mongodb+srv://dbUser:dbUserPassword@cluster0.vxi6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const DB = "fc21";

let didConnect = false;

async function getUsersCollection() {
  if (!didConnect) {
    await client.connect();
    didConnect = true;
  }
  return client.db(DB).collection("users");
}

module.exports = {
  getUsersCollection,
};
