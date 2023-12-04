const fs = require("node:fs");

// function to check if a given position is adjacent to a part number
function isAdjacentToPartNumber(row, col, partNumbers) {
  return partNumbers.some((part) => {
    // check if the given position is adjacent (including diagonals) to the part number's range
    for (let i = part.startRow; i <= part.endRow; i++) {
      for (let j = part.startCol; j <= part.endCol; j++) {
        if (Math.abs(row - i) <= 1 && Math.abs(col - j) <= 1) {
          return true;
        }
      }
    }
    return false;
  });
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
  let partNumbers = [];
  let validGears = [];

  // identify part numbers
  for (let i = 0; i < data_height; i++) {
    for (let j = 0; j < data_width; j++) {
      if (/\d/.test(data[i][j])) {
        let number = data[i][j];
        let startCol = j;
        let k = j + 1;
        while (k < data_width && /\d/.test(data[i][k])) {
          number += data[i][k];
          k++;
        }
        partNumbers.push({
          number: Number(number),
          startRow: i,
          startCol: startCol,
          endRow: i,
          endCol: k - 1,
        });
        j = k - 1;
      }
    }
  }

  // identify valid gears
  for (let i = 0; i < data_height; i++) {
    for (let j = 0; j < data_width; j++) {
      if (data[i][j] === "*") {
        let adjacentParts = partNumbers.filter((part) =>
          isAdjacentToPartNumber(i, j, [part])
        );
        if (adjacentParts.length >= 2) {
          validGears.push({ row: i, col: j, parts: adjacentParts });
        }
      }
    }
  }
  let gearRatioTotal = 0;
  validGears.forEach((gear) => {
    gearRatioTotal += gear.parts[0].number * gear.parts[1].number;
  });
  console.log(gearRatioTotal);
});
