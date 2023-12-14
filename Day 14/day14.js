let startTime = process.hrtime();
const fs = require("fs");

function writeMatrixToFile(matrix, filePath) {
  console.log(`\nWriting matrix to ${filePath}...`);
  const lines = matrix.map((row) => row.join(" "));

  const fileContent = lines.join("\n");

  fs.writeFileSync(filePath, fileContent, "utf8");
}

function integerSumTo(number) {
  return (number * (number + 1)) / 2;
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const rocks = lines.map((element) => element.split(""));
  return rocks;
}

function addSquareRocks(rocks) {
  const width = rocks[0].length;
  let squareArray = new Array(width).fill("#");
  rocks.unshift(squareArray);
  rocks.push(squareArray);
  return rocks;
}

function parseRocks(rocks) {
  let squareRocks = [];
  let roundRocks = [];
  for (let i = 0; i < rocks.length; i++) {
    for (let j = 0; j < rocks[0].length; j++) {
      if (rocks[i][j] === "O") {
        roundRocks.push([i, j]);
      } else if (rocks[i][j] === "#") {
        squareRocks.push([i, j]);
      } else if (rocks[i][j] === ".") {
        continue;
      } else {
        throw new Error(
          `Invalid input. Invalid rock at [${i},${j}]: ${rocks[i][j]}`
        );
      }
    }
  }
  return { squareRocks, roundRocks };
}

function findRocksBelow(rocksGrid) {
  const width = rocksGrid[0].length;
  const height = rocksGrid.length;
  let rocksBelow = new Map();
  for (j = 0; j < width; j++) {
    for (i = 0; i < height - 1; i++) {
      currentRock = rocksGrid[i][j];
      if (currentRock === "O" || currentRock === ".") continue;
      // Find next square rock below and count the round rocks in between
      let rocksBetween = 0;
      let k = i + 1;
      let belowRock = rocksGrid[k][j];
      while (belowRock !== "#") {
        if (belowRock === "O") rocksBetween++; // Adding a round rock to the rock above
        k++;
        belowRock = rocksGrid[k][j];
      }
      if (rocksBetween > 0) rocksBelow.set([i, j], rocksBetween);
      // if (k - i > 1) rockPairs.set([i, j], [k, j]); // Only map rocks with a gap between them and the rock below
    }
  }
  return rocksBelow;
}

function slideNorth(rocks, squareRocks, roundRocks) {
  let rockPairs = findRocksBelow(rocks);
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  let rocksGrid = readFileAndParse(filePath);
  // Pad top and bottom of rocks array with square rocks
  // I have a feeling I'll regret this in part 2
  // If I want to pad to sides, I should use .map(element => element.unshift("#").push("#"))
  rocksGrid = addSquareRocks(rocksGrid);
  const { squareRocks, roundRocks } = parseRocks(rocksGrid);
  const rocksBelow = findRocksBelow(rocksGrid);

  // Now we calculate total load on North supports
  let totalLoad = 0;
  const height = rocksGrid.length;
  rocksBelow.forEach((rockBelowCount, squareRock) => {
    let i = squareRock[0];
    totalLoad +=
      rockBelowCount * (height - i - 1) - integerSumTo(rockBelowCount);
  });
  // console.log(rocksBelow);
  console.log(totalLoad);
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
