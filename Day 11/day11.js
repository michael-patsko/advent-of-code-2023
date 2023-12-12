const fs = require("fs");

function writeMatrixToFile(matrix, filePath) {
  console.log(`\nWriting matrix to ${filePath}...`);
  const lines = matrix.map((row) => row.join(" "));

  const fileContent = lines.join("\n");

  fs.writeFileSync(filePath, fileContent, "utf8");
}

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

function copyMatrix(matrix) {
  return matrix.map((row) => [...row]);
}

// Converts i and j to Cartesian x and y
function convertToCartesian(i, j, matrix) {
  // coord [i, j], where i is column and j is row
  // suppose we have [1 ,2] for 7 by 7 matrix
  // this is equivalent to (2, 6)
  // for [i, j] we have (j, height - i)

  let height = matrix.length;

  let x = j;
  let y = height - i;
  return [x, y];
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const image = [];
  for (let i = 0; i < lines.length; i++) {
    image.push(lines[i].split(""));
  }
  return image;
}

function findEmptyRowsColumns(image) {
  let height = image.length;
  let width = image[0].length;
  let emptyRows = [];
  let emptyColumns = [];

  // Check for empty rows
  for (let row = 0; row < height; row++) {
    if (image[row].every((element) => element === ".")) emptyRows.push(row);
  }

  // Check for empty columns
  for (let col = 0; col < width; col++) {
    let isColumnEmpty = true;
    for (let row = 0; row < height; row++) {
      if (image[row][col] !== ".") {
        isColumnEmpty = false;
        break;
      }
    }
    if (isColumnEmpty) {
      emptyColumns.push(col);
    }
  }

  return { emptyRows, emptyColumns };
}
// Don't forget to update indices after inserting rows or columns
function insertToRight(image, colIndex, number = 1) {
  if (number < 1)
    throw new Error(
      "Invalid number. Number must be greater or equal to 1.",
      number
    );

  let newImage = image.map((row) => {
    // Split the row into two parts at the colIndex
    const leftPart = row.slice(0, colIndex + 1);
    const rightPart = row.slice(colIndex + 1);

    // Create the new columns to be inserted
    const newColumns = new Array(number).fill(".");

    // Combine the parts and the new columns
    return leftPart.concat(newColumns).concat(rightPart);
  });
  return newImage;
}

function insertBelow(image, rowIndex, number = 1) {
  if (number < 1)
    throw new Error(
      "Invalid number. Number must be greater or equal to 1.",
      number
    );
  const width = image[0].length;
  let emptyRows = [];
  for (i = 0; i < number; i++) {
    const emptyRow = new Array(width).fill(".");
    emptyRows = emptyRows.concat([emptyRow]);
  }
  const newImage = image
    .slice(0, rowIndex)
    .concat(emptyRows)
    .concat(image.slice(rowIndex, image.length));
  return newImage;
}

function XchooseY() {}

function replaceWithNumbers(matrix) {
  const height = matrix.length;
  const width = matrix[0].length;
  let locations = new Map();

  let counter = 1;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (matrix[i][j] === "#") {
        matrix[i][j] = counter;
        locations.set(counter, [i, j]);
        counter += 1;
      }
    }
  }
  return { matrix, locations };
}

function breadthFirstSearch(matrix, start, end) {
  const height = matrix.length;
  const width = matrix[0].length;
  const visited = new Set();
  const queue = [[start, 0]]; // Each element in the queue takes the form [[row, col], 0]

  function isValid(row, col) {
    return (
      row >= 0 &&
      row < height &&
      col >= 0 &&
      col < width &&
      !visited.has(`${row},${col}`)
    );
  }

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [[row, col], distance] = queue.shift();

    // Check if we've reached our goal
    if (row === end[0] && col === end[1]) {
      return distance;
    }

    visited.add(`${row},${col}`);

    // Explore adjacent cells
    for (let [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (isValid(newRow, newCol)) {
        queue.push([[newRow, newCol], distance + 1]);
      }
    }
  }
  return -1; // If no path is found
}

function manhattanDistance(matrix, start, end) {
  [x1, y1] = convertToCartesian(start[0], start[1], matrix);
  [x2, y2] = convertToCartesian(end[0], end[1], matrix);

  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  let image = readFileAndParse(filePath);
  let { emptyRows, emptyColumns } = findEmptyRowsColumns(image);
  const number = 1;
  // Galactic expansion
  for (let i in emptyRows) {
    image = insertBelow(image, emptyRows[i], number);
    emptyRows = emptyRows.map((row) => row + number);
  }
  for (let j in emptyColumns) {
    image = insertToRight(image, emptyColumns[j], number);
    emptyColumns = emptyColumns.map((column) => column + number);
  }

  // This functions also creates a map of galaxies and their coordinates
  const { matrix, locations } = replaceWithNumbers(image);

  let starts = [];
  let ends = [];
  locations.forEach((location) => {
    starts.push(location);
    ends.unshift(location);
  });

  let totalDistance = 0;

  for (let i = 1; i <= locations.size; i++) {
    for (let j = i + 1; j <= locations.size; j++) {
      let start = locations.get(i);
      let end = locations.get(j);
      if (arraysEqual(start, end)) continue;
      let distance = manhattanDistance(matrix, start, end);
      totalDistance += distance;
    }
  }

  console.log("Total distance: ", totalDistance);
  // writeMatrixToFile(matrix, "output.txt");
  // console.log("Output.txt saved successfully.");
}

main("input");
