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
