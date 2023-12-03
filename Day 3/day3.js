const fs = require("node:fs");

function isAdjacentToSymbol(row, col, matrix) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let [dr, dc] of directions) {
    const newRow = row + dr,
      newCol = col + dc;

    // check if newRow and newCol are within the bounds of the matrix
    if (
      newRow >= 0 &&
      newRow < matrix.length &&
      newCol >= 0 &&
      newCol < matrix[newRow].length
    ) {
      const adjChar = matrix[newRow][newCol];
      if (adjChar.match(/[^.\d]/g)) {
        return true;
      }
    }
  }
  return false;
}

// read input file
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  data = data.split(/\r?\n/);
  data = data.map((element) => element.split(""));
  let data_height = data.length;
  let data_width = data[0].length;
  let validNumbers = [];
  for (i = 0; i < data_height; i++) {
    for (j = 0; j < data_width; j++) {
      if (/\d/.test(data[i][j])) {
        let valid = false;
        // check if the character is a digit
        let number = data[i][j];
        if (isAdjacentToSymbol(i, j, data)) valid = true;
        let k = j + 1;
        // continue to look ahead in the same line for more digits
        while (k < data_width && /\d/.test(data[i][k])) {
          if (isAdjacentToSymbol(i, k, data)) valid = true;
          number += data[i][k];
          k++;
        }
        // convert the string to a number and add it to the numbers array
        if (valid) validNumbers.push(Number(number));
        // skip the indices that have already been processed
        j = k - 1;
      }
    }
  }
  validNumbersSum = validNumbers.reduce((a, b) => a + b, 0);
  console.log(validNumbersSum);
});
