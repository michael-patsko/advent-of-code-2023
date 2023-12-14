let startTime = process.hrtime();
const fs = require("fs");

// Taken from https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
// Thanks to Cem Kalyoncu: https://github.com/cemkalyoncu
function replaceAt(string, index, replacement) {
  return (
    string.substring(0, index) +
    replacement +
    string.substring(index + replacement.length)
  );
}

function removeFromArray(array, number) {
  return array.filter((element) => element !== number);
}

// Adapted from https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
// Thanks to Nitin Jadhav: https://github.com/nitinja
function rotateBlock(block, direction = "anticlockwise") {
  let newBlock = block.split(/\r?\n/).map((element) => element.split(""));
  if (direction === "anticlockwise") {
    newBlock = newBlock[0].map((val, index) =>
      newBlock.map((row) => row[row.length - 1 - index])
    );
    return newBlock.map((element) => element.join("")).join("\n");
  } else if (direction === "clockwise") {
    newBlock = newBlock[0].map((val, index) =>
      newBlock.map((row) => row[index]).reverse()
    );
    return newBlock.map((element) => element.join("")).join("\n");
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
  possibleColumns = possibleColumns.map((element) => element + 1);
  if (possibleColumns.length >= 1) {
    return possibleColumns;
  } else if (possibleColumns.length === 0) {
    return [];
  } else {
    throw new Error(`Error with possibleColumns: ${possibleColumns}`);
  }
}

function findHorizontalReflection(block) {
  let newBlock = rotateBlock(block, "anticlockwise");
  let result = findVerticalReflection(newBlock);
  return result;
}

const filePath = "input.txt";
const blocks = readFileAndParse(filePath);
const totalBlocks = blocks.length;

for (const part2 of [false, true]) {
  part2 ? console.log("\n--- Part 2 ---\n") : console.log("\n--- Part 1 ---\n");
  let total = 0;
  let blockCounter = 0;
  const loadingBarLength = 50; // Length of the loading bar
  for (let j = 0; j < blocks.length; j++) {
    let block = blocks[j];
    let initialVertical = [];
    let initialHorizontal = [];

    initialVertical = findVerticalReflection(block);
    initialHorizontal = findHorizontalReflection(block);

    if (part2) {
      // Part 2
      for (let i = 0; i < block.length; i++) {
        // Initialise copy of block, character we're looking at, and a value we will use to break out if we find the smudge
        let newBlock = block;
        let char = newBlock[i];
        let found = false;
        // Replace the character
        if (char === "\n") {
          continue;
        } else if (char === ".") {
          newBlock = replaceAt(newBlock, i, "#");
        } else if (char === "#") {
          newBlock = replaceAt(newBlock, i, ".");
        }

        let newVertical = findVerticalReflection(newBlock);
        let newHorizontal = findHorizontalReflection(newBlock);
        let newVLength = newVertical.length;
        let newHLength = newHorizontal.length;

        // We have 6 cases:
        // Case 0: newHorizontal.length === 0; newVertical.length === 0
        //   This is when adding the smudge has somehow ruined our old solution and not created a new one
        // Case 1: newHorizontal.length === 0; newVertical.length === 1
        //   This is when adding the smudge has either created a new solution or newVertical matches initialColumn
        // Case 2: newHorizontal.length === 0; newVertical.length === 2
        //   This is when adding the smudge has created a new solution in newVertical
        // Case 3: newHorizontal.length === 1; newVertical.length === 0
        //   This is when adding the smudge has either created a new solution or newHorizontal
        //  matches initialRow
        // Case 4: newHorizontal.length === 1; newVertical.length === 1
        //   This is when a new solution has been created in either of them
        // Case 5: newHorizontal.length === 2; newVertical.length === 0
        //   This is when adding the smudge has created a new solution in newHorizontal

        // Case 0
        if (newHLength === 0 && newVLength === 0) {
          continue;
          // Case 1
        } else if (newHLength === 0 && newVLength === 1) {
          if (newVertical[0] !== initialVertical[0]) {
            total += newVertical[0];
            found = true;
            blockCounter += 1;
          } else {
            continue;
          }
          // Case 2
        } else if (newHLength === 0 && newVertical.length === 2) {
          let index = newVertical.findIndex(
            (element) => element !== initialVertical[0]
          );
          total += newVertical[index];
          found = true;
          blockCounter += 1;
          // Case 3
        } else if (newHLength === 1 && newVLength === 0) {
          if (newHorizontal[0] !== initialHorizontal[0]) {
            total += 100 * newHorizontal[0];
            found = true;
            blockCounter += 1;
          } else {
            continue;
          }
          // Case 4
        } else if (newHLength === 1 && newVLength === 1) {
          if (newHorizontal[0] === initialHorizontal[0]) {
            total += newVertical[0];
            found = true;
            blockCounter += 1;
          } else {
            total += 100 * newHorizontal[0];
            found = true;
            blockCounter += 1;
          }
        }
        // Case 5
        else if (newHLength === 2 && newVLength === 0) {
          let index = newHorizontal.findIndex(
            (element) => element !== initialHorizontal[0]
          );
          total += 100 * newHorizontal[index];
          found = true;
          blockCounter += 1;
        } else {
          throw new Error("No new reflection found in block.");
        }
        if (found) break;
      }
    } else {
      initialVertical.length === 0
        ? (total += 100 * initialHorizontal[0])
        : (total += initialVertical[0]);
      blockCounter += 1;
    }
    const filledLength = Math.floor((blockCounter / 100) * loadingBarLength);
    const bar =
      "█".repeat(filledLength) + "-".repeat(loadingBarLength - filledLength);
    process.stdout.write(`\r[${bar}] ${blockCounter}%`);
  }
  console.log(`\nTotal:`, total);
}

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
