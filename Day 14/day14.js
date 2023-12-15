let startTime = process.hrtime();
const fs = require("fs");

function writeMatrixToFile(matrix, filePath) {
  console.log(`\nWriting matrix to ${filePath}...`);
  const lines = matrix.map((row) => row.join(" "));

  const fileContent = lines.join("\n");

  fs.writeFileSync(filePath, fileContent, "utf8");
}

function matrixToString(matrix) {
  return matrix.map((row) => row.join(",")).join(";");
}

function stringToMatrix(matrixString) {
  // Split the string into rows
  let rows = matrixString.split(";");

  // Split each row into its elements
  return rows.map((row) => row.split(","));
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const rocks = lines.map((element) => element.split(""));
  return rocks;
}

function addSquareRocks(rocksGrid) {
  const width = rocksGrid[0].length;
  let topPadding = new Array(width).fill("#");
  let bottomPadding = new Array(width).fill("#");
  rocksGrid.unshift(topPadding);
  rocksGrid.push(bottomPadding);
  rocksGrid.forEach((row) => {
    row.unshift("#");
    row.push("#");
  });
  return rocksGrid;
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
  for (let j = 0; j < width; j++) {
    for (let i = 0; i < height - 1; i++) {
      currentRock = rocksGrid[i][j];
      if (currentRock === "O" || currentRock === ".") continue;
      // Find next square rock below and count the round rocks in between
      let rocksBetween = 0;
      let k = i + 1;
      let belowRock = rocksGrid[k][j];
      while (belowRock !== "#") {
        if (belowRock === "O") {
          rocksBetween++; // Adding a round rock to the rock above
          rocksGrid[k][j] = ".";
        }
        k++;
        belowRock = rocksGrid[k][j];
      }
      if (rocksBetween > 0) rocksBelow.set([i, j], rocksBetween);
      // if (k - i > 1) rockPairs.set([i, j], [k, j]); // Only map rocks with a gap between them and the rock below
    }
  }
  return rocksBelow;
}

function findRocksAbove(rocksGrid) {
  const width = rocksGrid[0].length;
  const height = rocksGrid.length;
  let rocksAbove = new Map();
  for (let j = 0; j < width; j++) {
    for (let i = height - 1; i > 0; i--) {
      currentRock = rocksGrid[i][j];
      if (currentRock === "O" || currentRock === ".") continue;
      // Find next square rock below and count the round rocks in between
      let rocksBetween = 0;
      let k = i - 1;
      let aboveRock = rocksGrid[k][j];
      while (aboveRock !== "#") {
        if (aboveRock === "O") {
          rocksBetween++; // Adding a round rock to the rock above
          rocksGrid[k][j] = ".";
        }
        k--;
        aboveRock = rocksGrid[k][j];
      }
      if (rocksBetween > 0) rocksAbove.set([i, j], rocksBetween);
      // if (k - i > 1) rockPairs.set([i, j], [k, j]); // Only map rocks with a gap between them and the rock below
    }
  }
  return rocksAbove;
}

function findRocksRight(rocksGrid) {
  const width = rocksGrid[0].length;
  const height = rocksGrid.length;
  let rocksRight = new Map();
  for (let j = 0; j < width - 1; j++) {
    for (let i = 0; i < height - 1; i++) {
      currentRock = rocksGrid[i][j];
      if (currentRock === "O" || currentRock === ".") continue;

      let rocksBetween = 0;
      let k = j + 1;
      let rightRock = rocksGrid[i][k];
      while (rightRock !== "#") {
        if (rightRock === "O") {
          rocksBetween++;
          rocksGrid[i][k] = ".";
        }
        k++;
        rightRock = rocksGrid[i][k];
      }
      if (rocksBetween > 0) rocksRight.set([i, j], rocksBetween);
    }
  }
  return rocksRight;
}

function findRocksLeft(rocksGrid) {
  const width = rocksGrid[0].length;
  const height = rocksGrid.length;
  let rocksLeft = new Map();
  for (let j = width - 1; j > 0; j--) {
    for (let i = 0; i < height - 1; i++) {
      currentRock = rocksGrid[i][j];
      if (currentRock === "O" || currentRock === ".") continue;

      let rocksBetween = 0;
      let k = j - 1;
      let rightRock = rocksGrid[i][k];
      while (rightRock !== "#") {
        if (rightRock === "O") {
          rocksBetween++;
          rocksGrid[i][k] = ".";
        }
        k--;
        rightRock = rocksGrid[i][k];
      }
      if (rocksBetween > 0) rocksLeft.set([i, j], rocksBetween);
    }
  }
  return rocksLeft;
}

function slideNorth(rocksGrid) {
  let rocksBelow = findRocksBelow(rocksGrid);
  rocksBelow.forEach((rockBelowCount, squareRock) => {
    let i = squareRock[0];
    let j = squareRock[1];
    for (let k = 1; k <= rockBelowCount; k++) {
      rocksGrid[i + k][j] = "O";
    }
  });
  return rocksGrid;
}

function slideSouth(rocksGrid) {
  let rocksAbove = findRocksAbove(rocksGrid);
  rocksAbove.forEach((rockAboveCount, squareRock) => {
    let i = squareRock[0];
    let j = squareRock[1];
    for (let k = 1; k <= rockAboveCount; k++) {
      rocksGrid[i - k][j] = "O";
    }
  });
  return rocksGrid;
}

function slideWest(rocksGrid) {
  let rocksRight = findRocksRight(rocksGrid);
  rocksRight.forEach((rockRightCount, squareRock) => {
    let i = squareRock[0];
    let j = squareRock[1];
    for (let k = 1; k <= rockRightCount; k++) {
      rocksGrid[i][j + k] = "O";
    }
  });
  return rocksGrid;
}

function slideEast(rocksGrid) {
  let rocksLeft = findRocksLeft(rocksGrid);
  rocksLeft.forEach((rockLeftCount, squareRock) => {
    let i = squareRock[0];
    let j = squareRock[1];
    for (let k = 1; k <= rockLeftCount; k++) {
      rocksGrid[i][j - k] = "O";
    }
  });
  return rocksGrid;
}

function spinCycle(rocksGrid, number) {
  let previousStates = new Map();
  let cycles = 0;
  let loopStart = -1;
  let loopEnd = -1;
  for (let i = 0; i < number; i++) {
    rocksGrid = slideNorth(rocksGrid);
    rocksGrid = slideWest(rocksGrid);
    rocksGrid = slideSouth(rocksGrid);
    rocksGrid = slideEast(rocksGrid);
    cycles++;
    let currentState = matrixToString(rocksGrid);
    if (previousStates.has(currentState)) {
      loopStart = previousStates.get(currentState);
      loopEnd = cycles;
      break;
    }
    previousStates.set(currentState, cycles);
  }
  let finalGrid = rocksGrid.map((arr) => arr.slice());
  return { finalGrid, loopStart, loopEnd, previousStates };
}

function calculateNorthLoad(rocksGrid) {
  let totalLoad = 0;
  const height = rocksGrid.length;
  const width = rocksGrid[0].length;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (rocksGrid[i][j] === "O") {
        totalLoad += height - i - 1;
      }
    }
  }
  return totalLoad;
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  let rocksGrid = readFileAndParse(filePath);
  rocksGrid = addSquareRocks(rocksGrid);
  const { squareRocks, roundRocks } = parseRocks(rocksGrid);

  let numCycles = 1000000000;
  const { finalGrid, loopStart, loopEnd, previousStates } = spinCycle(
    rocksGrid,
    numCycles
  );
  const loopLength = loopEnd - loopStart;
  const remainingCycles = (numCycles - loopStart) % loopLength;
  const finalStateCycle = loopStart + remainingCycles;

  let finalStateString = "";
  previousStates.forEach((value, key) => {
    if (value === finalStateCycle) finalStateString = key;
  });

  const finalState = stringToMatrix(finalStateString);
  const totalLoad = calculateNorthLoad(finalState);

  console.log(
    `Total load on north supports after ${numCycles} cycles:`,
    totalLoad
  );

  writeMatrixToFile(finalGrid, "output.txt");
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
