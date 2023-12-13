let startTime = process.hrtime();
const fs = require("fs");

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  return lines;
}

// code goes here

const filePath = "test.txt";
const lines = readFileAndParse(filePath);
console.log(lines);

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
