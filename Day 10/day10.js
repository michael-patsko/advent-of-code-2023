const fs = require("fs");

// Taken from https://stackoverflow.com/questions/22395357/how-to-compare-two-arrays-are-equal-using-javascript
function arraysEqual(arr1, arr2) {
  // Checks if 2 arrays have the same length, and are equal elementwise, and determines the arrays to be equal if so
  const result =
    arr1.length == arr2.length &&
    arr1.every(function (element, index) {
      return element === arr2[index];
    });
  return result;
}

// Taken from https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality
function setsEqual(set1, set2) {
  result = (set1, set2) =>
    set1.size === set2.size && [...set1].every((value) => set2.has(value));
  return result(set1, set2);
}

function writeMatrixToFile(matrix, filePath) {
  console.log(`Writing matrix to ${filePath}`);
  const lines = matrix.map((row) => row.join(" "));

  const fileContent = lines.join("\n");

  fs.writeFileSync(filePath, fileContent, "utf8");
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  let pipesGrid = [];
  for (let i = 0; i < lines.length; i++) {
    pipesGrid.push(lines[i].split(""));
  }
  return pipesGrid;
}

function findStartPoint(pipesGrid) {
  const height = pipesGrid.length;
  const width = pipesGrid[0].length;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (pipesGrid[i][j] === "S") return [i, j];
    }
  }
  throw new Error("No starting point found.");
}

function getNextPositions(i, j, pipesGrid) {
  const movementDirections = {
    "|": [
      [-1, 0],
      [1, 0],
    ],
    "-": [
      [0, 1],
      [0, -1],
    ],
    L: [
      [-1, 0],
      [0, 1],
    ],
    J: [
      [0, -1],
      [-1, 0],
    ],
    7: [
      [1, 0],
      [0, -1],
    ],
    F: [
      [0, 1],
      [1, 0],
    ],
  };

  let currentCell = pipesGrid[i][j];
  return (movementDirections[currentCell] || []).map((direction) => [
    i + direction[0],
    j + direction[1],
  ]);
}

function followPipes(pipesGrid, startPoint, traversalDirection) {
  let visited = new Set(); // This will store our visited grid points
  visited.add(startPoint.join(",")); // Convert array to string
  let nextPoint;

  let loopDistance = 0;
  if (traversalDirection === "forward") {
    nextPoint = getNextPositions(startPoint[0], startPoint[1], pipesGrid)[0];
  } else if (traversalDirection === "backward") {
    nextPoint = getNextPositions(startPoint[0], startPoint[1], pipesGrid)[1];
  } else {
    throw new Error(`Invalid direction: ${traversalDirection}`);
  }
  let currentPoint = nextPoint;
  let previousPoint = startPoint;

  while (!arraysEqual(currentPoint, startPoint)) {
    let nextPositions = getNextPositions(
      currentPoint[0],
      currentPoint[1],
      pipesGrid
    );

    let nextPositionKey = nextPositions[0].join(",");
    let nextPoint = nextPositions[0];

    if (arraysEqual(previousPoint, nextPoint)) {
      nextPoint = nextPositions[1];
    }

    visited.add(currentPoint.join(","));
    previousPoint = currentPoint;
    currentPoint = nextPoint;
    loopDistance += 1;
  }
  loopDistance += 1;
  return visited;
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  const originalGrid = readFileAndParse(filePath);
  const startPoint = findStartPoint(originalGrid);

  let startPipes = ["|", "-", "L", "7", "J", "F"];

  for (pipe of startPipes) {
    try {
      console.log("---");
      let pipesGrid = originalGrid.map((row) => [...row]);
      pipesGrid[startPoint[0]][startPoint[1]] = pipe;
      const visitedForward = followPipes(pipesGrid, startPoint, "forward");
      const visitedBackward = followPipes(pipesGrid, startPoint, "backward");
      const maxSteps = visitedForward.size / 2;

      // Check if the loop is the same when followed in both directions
      if (setsEqual(visitedForward, visitedBackward)) {
        let loopNodes = [];

        const pipeToUnicodeMapping = {
          "|": "│", // Vertical line
          "-": "─", // Horizontal line
          J: "╯", // Angle down and left
          7: "╮", // Angle up and left
          F: "╭", // Angle up and right
          L: "╰", // Angle down and right
        };

        visitedForward.forEach((node) => {
          loopNodes.push(node.match(/\d+/g).map(Number));
        });
        loopNodes.forEach((node) => {
          const [i, j] = node;
          const pipeType = pipesGrid[i][j];
          pipesGrid[i][j] = pipeToUnicodeMapping[pipeType] || pipeType;
        });

        writeMatrixToFile(pipesGrid, "output.txt");
        console.log("File writing complete.");

        console.log(`Max steps for start pipe ${pipe}:`, maxSteps);
      } else {
        console.error(`Invalid loop for start pipe: ${pipe}`);
      }
    } catch (error) {
      console.error(`Invalid loop for start pipe: ${pipe}`);
    }
  }
}

main("input");
