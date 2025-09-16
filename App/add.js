const main = require("./app");

async function run() {
  const { collection } = await main();

  // 每次运行前清空集合，避免重复数据
  await collection.drop().catch(() => console.log("Collection not found, creating new one."));

  const products = [
    { id: 1, name: "Laptop", description: "14 inch laptop", price: 1200.50, units: 10 },
    { id: 2, name: "Phone", description: "Smartphone with 128GB storage", price: 699.99, units: 20 },
    { id: 3, name: "Headphones", description: "Noise cancelling headphones", price: 199.99, units: 15 }
  ];

  const result = await collection.insertMany(products);
  console.log("Inserted products:", result.insertedCount);

  process.exit();
}

run();