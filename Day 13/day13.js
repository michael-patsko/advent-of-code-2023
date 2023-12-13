let startTime = process.hrtime();
const fs = require("fs");

function removeFromArray(array, number) {
  return array.filter((element) => element !== number);
}

// Adapted from https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
// Thanks to Nitin Jadhav: https://github.com/nitinja
function rotateBlock(block, direction = "anticlockwise") {
  block = block.split(/\r?\n/).map((element) => element.split(""));
  if (direction === "anticlockwise") {
    block = block[0].map((val, index) =>
      block.map((row) => row[row.length - 1 - index])
    );
    return block.map((element) => element.join("")).join("\n");
  } else if (direction === "clockwise") {
    block = block[0].map((val, index) =>
      block.map((row) => row[index]).reverse()
    );
  } else {
    throw new Error("Invalid rotation direction: ", direction);
  }
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\r/g, ""));
  return blocks;
}

function findVerticalReflection(block) {
  // Define line of reflection using column number to left of line
  let lines = block.split(/\r?\n/);
  let validReflection = true;
  let possibleColumns = [...Array(lines[0].length - 1).keys()];
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let line = lines[lineIndex];
    for (let charIndex = 1; charIndex < line.length; charIndex++) {
      let kLimit = line.length / 2 - Math.abs(charIndex - line.length / 2);
      for (let k = 0; k < kLimit; k++) {
        if (line[charIndex + k] !== line[charIndex - 1 - k]) {
          possibleColumns = removeFromArray(possibleColumns, charIndex - 1);
          break;
        }
      }
    }
  }
  if (possibleColumns.length === 1) {
    return possibleColumns[0] + 1;
  } else if (possibleColumns.length === 0) {
    return 0;
  } else {
    throw new Error(`Too many vertical reflections in block:\n`, block);
  }
}

function findHorizontalReflection(block) {
  block = rotateBlock(block, "anticlockwise");
  return findVerticalReflection(block);
}

const filePath = "input.txt";
const blocks = readFileAndParse(filePath);
let total = 0;
for (let block of blocks) {
  let verticalColumns = 0;
  let horizontalRows = 0;
  verticalColumns = findVerticalReflection(block);
  if (verticalColumns === 0) {
    horizontalRows = findHorizontalReflection(block);
  }
  total += verticalColumns;
  total += 100 * horizontalRows;
}

console.log(`Total:`, total);
let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
