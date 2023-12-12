const fs = require("fs");

// Taken from https://stackoverflow.com/questions/24241462/how-to-search-for-multiple-indexes-of-same-values-in-javascript-array
Array.prototype.findIndices = function (element) {
  var indices = [];
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] === element) {
      indices.unshift(i);
    }
  }
  return indices;
};

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

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  let springs = new Map();
  for (line of lines) {
    let symbols = line.match(/[?#.]+(?=\s)/g);
    let numbers = line.match(/\d+/g).map(Number);
    springs.set(symbols, numbers);
  }
  return springs;
}

function findArrangements(symbols, numbers) {
  let count = numbers.reduce((a, b) => a + b, 0);
  symbols = symbols[0].split("");
  let unknownIndices = symbols.findIndices("?");

  let arrangements = [];
  generateCombinations(symbols, unknownIndices, 0, arrangements);
  arrangements = arrangements.filter((arrangement) => {
    const matches = arrangement.match(/#+/g);
    if (!matches) return false;
    return arraysEqual(
      matches.map((element) => element.length),
      numbers
    );
  });
  return arrangements.length;
}

function generateCombinations(array, indices, currentIndex, result) {
  // When all combinations have been considered
  if (currentIndex === indices.length) {
    result.push(array.join(""));
    return;
  }

  // Temporarily replace the character at currentIndex with #
  // Runs this function recursively, incrementing currentIndex by 1
  // Each call builds upon the previous, creating a new combination
  array[indices[currentIndex]] = "#";
  generateCombinations(array, indices, currentIndex + 1, result);

  // Effectively does the same as above, but for questions marks
  // Thereby creating all combinations of # and ?
  array[indices[currentIndex]] = "?";
  generateCombinations(array, indices, currentIndex + 1, result);
}

const filePath = "input.txt";
const springs = readFileAndParse(filePath);
let totalArrangements = 0;
springs.forEach((numbers, symbols) => {
  let arrangements = findArrangements(symbols, numbers);
  totalArrangements += arrangements;
});
console.log(totalArrangements);
