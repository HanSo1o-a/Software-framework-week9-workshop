const main = require("./app");

async function run() {
  const { collection } = await main();
  const items = await collection.find({}).toArray();
  console.log("Products:", items);
  process.exit();
}

run();