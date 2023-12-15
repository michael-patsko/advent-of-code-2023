let startTime = process.hrtime();
const fs = require("fs");

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const steps = content.split(",");
  return steps;
}

function hashAlgo(str) {
  let currentValue = 0;
  for (let i = 0; i < str.length; i++) {
    try {
      currentValue += str[i].charCodeAt(0);
    } catch (error) {
      throw new Error(`Invalid ASCII character: ${str[i]}`);
    }
    currentValue = currentValue * 17;
    currentValue = currentValue % 256;
  }
  return currentValue;
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  const steps = readFileAndParse(filePath);

  let hashTotal = 0;
  for (let i = 0; i < steps.length; i++) {
    let hashValue = hashAlgo(steps[i]);
    // console.log(`HASH value for ${steps[i]}:`, hashValue);
    hashTotal += hashValue;
  }
  console.log(`HASH total is: `, hashTotal);
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
