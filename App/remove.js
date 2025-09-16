const main = require("./app");

async function run() {
  const { collection } = await main();
  const result = await collection.deleteOne({ id: 3 });
  console.log("Deleted:", result.deletedCount);
  process.exit();
}

run();