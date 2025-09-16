// app.js
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017"; // 本地 MongoDB 地址
const client = new MongoClient(url);
const dbName = "mydb";

async function main() {
  await client.connect();
  console.log("✅ Connected successfully to MongoDB");
  const db = client.db(dbName);
  const collection = db.collection("products");
  return { db, collection };
}

module.exports = main;