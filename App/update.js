const main = require("./app");

async function run() {
  const { collection } = await main();
  const result = await collection.updateOne(
    { id: 2 },
    { $set: { price: 749.99, units: 18 } }
  );
  console.log("Updated:", result.modifiedCount);
  process.exit();
}

run();