// server/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// === Mongo 连接 ===
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "mydb";

let collection;

async function connectDB() {
  await client.connect();
  console.log("✅ Connected to MongoDB");
  const db = client.db(dbName);
  collection = db.collection("products");

  // 给业务 id 建唯一索引，避免重复（等价于你在 POST 时做的检查）
  try {
    await collection.createIndex({ id: 1 }, { unique: true });
  } catch (e) {
    console.warn("Index create warning:", e.message);
  }
}
connectDB().catch(err => {
  console.error("❌ Mongo connect failed:", err);
  process.exit(1);
});

// === 路由 ===

// 1) 获取全部产品
app.get("/products", async (req, res) => {
  try {
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Server error", detail: e.message });
  }
});

// 2) 新增（检查 id 重复）
app.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;

    // 基础校验（可按需精简）
    if (
      typeof newProduct.id !== "number" ||
      typeof newProduct.name !== "string" ||
      typeof newProduct.description !== "string" ||
      typeof newProduct.price !== "number" ||
      typeof newProduct.units !== "number"
    ) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // 业务 id 唯一
    const exists = await collection.findOne({ id: newProduct.id });
    if (exists) {
      return res.status(400).json({ message: "❌ Product with this id already exists" });
    }

    await collection.insertOne(newProduct);
    res.json({ message: "✅ Product added" });
  } catch (e) {
    res.status(500).json({ message: "Server error", detail: e.message });
  }
});

// 3) 获取单个产品（通过 MongoDB _id）—— 给前端 Update 页面用
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let query;
    // 如果是合法的 24 位 hex 字符串，就当 ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: id }; // 否则当字符串处理
    }

    const doc = await collection.findOne(query);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: "Invalid ObjectId" });
  }
});

// 4) 删除（通过 MongoDB _id）
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const _id = new ObjectId(id);
    const result = await collection.deleteOne({ _id });
    res.json({ deleted: result.deletedCount });
  } catch (e) {
    res.status(400).json({ message: "Invalid ObjectId" });
  }
});

// 5) 更新（通过 MongoDB _id）
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const _id = new ObjectId(id);
    // 不允许把 _id 覆盖
    delete updatedData._id;

    const result = await collection.updateOne({ _id }, { $set: updatedData });
    res.json({ modified: result.modifiedCount });
  } catch (e) {
    res.status(400).json({ message: "Invalid ObjectId" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});