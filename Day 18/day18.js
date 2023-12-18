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
  const directions = ["R", "D", "L", "U"];
  let instructions = [];
  lines.forEach((line) => {
    let directionIndex = line.match(/(?<=#[\w\d]{5})\w{1}/g)[0];
    let direction = directions[directionIndex];
    let distance = parseInt(line.match(/(?<=#)[\w\d]{5}/g)[0], 16);
    instructions.push({
      direction: direction,
      distance: distance,
    });
  });
  return instructions;
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

  let startCoord = [startY, startX];
  let currentCoord = startCoord;
  let totalArea = 0;

  for (let n = 0; n < instructions.length; n++) {
    const instruction = instructions[n];
    const direction = instruction.direction;
    const distance = instruction.distance;
    const i = currentCoord[0];
    const j = currentCoord[1];
    let previousCoord = [i, j];

    switch (direction) {
      case "R":
        for (let k = 1; k <= distance; k++) {
          previousCoord = [currentCoord[0], currentCoord[1]];
          currentCoord[1] = j + k;
          totalArea += determinantOfPoints(previousCoord, currentCoord);
        }
        break;
      case "L":
        for (let k = 1; k <= distance; k++) {
          previousCoord = [currentCoord[0], currentCoord[1]];
          currentCoord[1] = j - k;
          totalArea += determinantOfPoints(previousCoord, currentCoord);
        }
        break;
      case "U":
        for (let k = 1; k <= distance; k++) {
          previousCoord = [currentCoord[0], currentCoord[1]];
          currentCoord[0] = i - k;
          totalArea += determinantOfPoints(previousCoord, currentCoord);
        }
        break;
      case "D":
        for (let k = 1; k <= distance; k++) {
          previousCoord = [currentCoord[0], currentCoord[1]];
          currentCoord[0] = i + k;
          totalArea += determinantOfPoints(previousCoord, currentCoord);
        }
        break;
      default:
        throw new Error(`Invalid direction: ${instruction.direction}`);
    }
  }
  totalArea += determinantOfPoints(currentCoord, startCoord);
  return Math.abs(totalArea / 2);
}

function determinantOfPoints(coord1, coord2) {
  let a = coord1[1];
  let b = coord2[1];
  let c = coord1[0];
  let d = coord2[0];
  return a * d - b * c;
}

function findArea(edgePoints) {
  let area = determinantOfPoints(
    edgePoints[edgePoints.length - 1],
    edgePoints[0]
  );
  for (i = 0; i < edgePoints.length - 1; i++) {
    area += determinantOfPoints(edgePoints[i], edgePoints[i + 1]);
  }
  return Math.abs(area / 2);
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  const instructions = readFileAndParse(filePath);

  // Fill in lagoon edges with their colour data
  const totalArea = followDirections(instructions);

  let exteriorPoints = 0;
  instructions.forEach((instruction) => {
    exteriorPoints += instruction.distance;
  });

  // Number of interior points is given by i = A + 1 - b/2, where A is the area and b is the number of points on the boundary
  const interiorPoints = totalArea + 1 - exteriorPoints / 2;

  // Add the number of points on edge to interior points to give us total lagoon volume
  const lagoonVolume = exteriorPoints + interiorPoints;
  console.log(`Lagoon volume:`, lagoonVolume);
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
