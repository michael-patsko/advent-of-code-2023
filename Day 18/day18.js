let startTime = process.hrtime();
const fs = require("fs");

function writeMatrixToFile(matrix, filePath) {
  console.log(`\nWriting matrix to ${filePath}...`);
  const lines = matrix.map((row) => row.join(" "));

  const fileContent = lines.join("\n");

  fs.writeFileSync(filePath, fileContent, "utf8");
}

function coordinateToString(coordinate) {
  return `${coordinate[0]},${coordinate[1]}`;
}

function stringToCoordinate(str) {
  return str.split(",").map(Number);
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  let instructions = [];
  lines.forEach((line) => {
    let direction = line.match(/\w(?=\s\d)/g)[0];
    let distance = Number(line.match(/(?<=\w\s)\d+/g)[0]);
    let colourCode = line.match(/(?<=\()#[\w\d]+(?=\))/g)[0];
    instructions.push({
      direction: direction,
      distance: distance,
      colourCode: colourCode,
    });
  });
  return instructions;
}

function generateMatrix(width, height, character) {
  let matrix = [];
  for (let i = 0; i < height; i++) {
    let row = new Array(width).fill(character);
    matrix.push(row);
  }
  return matrix;
}

function findBoundsAndStartPoint(instructions) {
  let minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;
  let x = 0,
    y = 0;

  instructions.forEach((instruction) => {
    switch (instruction.direction) {
      case "R":
        x += instruction.distance;
        maxX = Math.max(maxX, x);
        break;
      case "L":
        x -= instruction.distance;
        minX = Math.min(minX, x);
        break;
      case "U":
        y -= instruction.distance;
        minY = Math.min(minY, y);
        break;
      case "D":
        y += instruction.distance;
        maxY = Math.max(maxY, y);
        break;
    }
  });

  // Calculate the size of the matrix
  let width = maxX - minX + 1;
  let height = maxY - minY + 1;

  // Calculate the starting point (adjusting for negative indices)
  let startX = 0 - minX;
  let startY = 0 - minY;

  return { width, height, startX, startY };
}

function followDirections(instructions) {
  const { width, height, startX, startY } =
    findBoundsAndStartPoint(instructions);

  // Generate a matrix that represents our lagoon
  let lagoon = generateMatrix(width, height, ".");

  let currentCoord = [startY, startX];
  let lagoonEdges = new Map();
  for (let n = 0; n < instructions.length; n++) {
    const instruction = instructions[n];
    const direction = instruction.direction;
    const distance = instruction.distance;
    const colourCode = instruction.colourCode;
    const i = currentCoord[0];
    const j = currentCoord[1];

    switch (direction) {
      case "R":
        for (let k = 1; k <= distance; k++) {
          lagoonEdges.set(coordinateToString([i, j + k]), colourCode);
          lagoon[i][j + k] = "#";
        }
        currentCoord[1] = j + distance;
        break;
      case "L":
        for (let k = 1; k <= distance; k++) {
          lagoonEdges.set(coordinateToString([i, j - k]), colourCode);
          lagoon[i][j - k] = "#";
        }
        currentCoord[1] = j - distance;
        break;
      case "U":
        for (let k = 1; k <= distance; k++) {
          lagoonEdges.set(coordinateToString([i - k, j]), colourCode);
          lagoon[i - k][j] = "#";
        }
        currentCoord[0] = i - distance;
        break;
      case "D":
        for (let k = 1; k <= distance; k++) {
          lagoonEdges.set(coordinateToString([i + k, j]), colourCode);
          lagoon[i + k][j] = "#";
        }
        currentCoord[0] = i + distance;
        break;
      default:
        throw new Error(`Invalid direction: ${instruction.direction}`);
    }
  }
  return { lagoon, lagoonEdges };
}

function determinantOfPoints(coord1, coord2, matrix) {
  // coord [i, j], where i is column and j is row
  // suppose we have [1 ,2] for 7 by 7 matrix
  // this is equivalent to (2, 6)
  // for [i, j] we have (j, height - i)

  let height = matrix.length;

  let x1 = coord1[1];
  let x2 = coord2[1];
  let y1 = height - coord1[0];
  let y2 = height - coord2[0];

  let a = x1;
  let b = x2;
  let c = y1;
  let d = y2;
  return a * d - b * c;
}

function findArea(edgePoints, matrix) {
  let area = determinantOfPoints(
    edgePoints[edgePoints.length - 1],
    edgePoints[0],
    matrix
  );
  for (i = 0; i < edgePoints.length - 1; i++) {
    area += determinantOfPoints(edgePoints[i], edgePoints[i + 1], matrix);
  }
  return Math.abs(area / 2);
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  const instructions = readFileAndParse(filePath);

  // Fill in lagoon edges with their colour data
  const { lagoon, lagoonEdges } = followDirections(instructions);
  writeMatrixToFile(lagoon, "output.txt");

  // Convert lagoonEdges coordinates to form usable by findArea
  const edgeCoordinates = Array.from(lagoonEdges.keys()).map((key) =>
    stringToCoordinate(key)
  );

  // We will find the interior points using Pick's theorem with the shoelace formula; similar to day 10
  const lagoonArea = findArea(edgeCoordinates, lagoon);

  // Number of interior points is given by i = A + 1 - b/2, where A is the area and b is the number of points on the boundary
  const interiorPoints = lagoonArea + 1 - edgeCoordinates.length / 2;

  // Add the number of points on edge to interior points to give us total lagoon volume
  const lagoonVolume = edgeCoordinates.length + interiorPoints;
  console.log(`Lagoon volume:`, lagoonVolume);
}

main("test");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
