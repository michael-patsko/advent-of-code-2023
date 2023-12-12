const fs = require("fs");

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

// Taken from Jonathan Paulson: https://github.com/jonathanpaulson/AdventOfCode/blob/master/2023/12.py
// Video explaining his solution found here: https://www.youtube.com/watch?v=xTGkP2GNmbQ

let dp = new Map();
// Create new map we will use to store previously seen solutions

function dynamicArrangements(
  symbols,
  numbers,
  symbolsIndex,
  numbersIndex,
  currentBlock // length of current block of "#"
) {
  // the last 3 variables define our state
  const key = `${symbolsIndex}-${numbersIndex}-${currentBlock}`;
  if (dp.has(key)) return dp.get(key); // If we have seen this configuration before, retrieve it from our map

  if (symbolsIndex === symbols.length) {
    if (numbersIndex === numbers.length && currentBlock === 0) {
      return 1; // ran through all blocks and no # being processed
    } else if (
      numbersIndex === numbers.length - 1 &&
      numbers[numbersIndex] === currentBlock
    ) {
      return 1; // on the last block and we've filled it in
    } else {
      return 0; // invalid block
    }
  }
  let result = 0;
  for (const char of [".", "#"]) {
    // place a . or #
    if (symbols[symbolsIndex] === char || symbols[symbolsIndex] === "?") {
      if (char === "." && currentBlock === 0) {
        result += dynamicArrangements(
          symbols,
          numbers,
          symbolsIndex + 1,
          numbersIndex,
          0
        );
      } else if (
        // move onto the next block
        char === "." &&
        currentBlock > 0 &&
        numbersIndex < numbers.length &&
        numbers[numbersIndex] === currentBlock
      ) {
        result += dynamicArrangements(
          symbols,
          numbers,
          symbolsIndex + 1,
          numbersIndex + 1,
          0
        );
      } else if (char === "#") {
        // increment current block
        result += dynamicArrangements(
          symbols,
          numbers,
          symbolsIndex + 1,
          numbersIndex,
          currentBlock + 1
        );
      }
    }
  }
  dp.set(key, result);
  return result;
}

const filePath = "input.txt";
const springs = readFileAndParse(filePath);

for (const part2 of [false, true]) {
  part2 ? console.log("\n--- Part 2 ---") : console.log("\n--- Part 1 ---");
  let totalArrangements = 0;
  let counter = 0;

  springs.forEach((numbers, symbols) => {
    if (part2) {
      symbols = [symbols, symbols, symbols, symbols, symbols].join("?");
      numbers = [numbers, numbers, numbers, numbers, numbers]
        .join(",")
        .split(",")
        .map(Number);
    } else {
      symbols = symbols[0];
    }

    dp.clear();
    let arrangements = dynamicArrangements(symbols, numbers, 0, 0, 0);
    totalArrangements += arrangements;
    counter += 1;
    if (counter % 100 === 0)
      console.log(`Number of springs processsed: `, counter);
  });
  console.log(`Total arrangements: `, totalArrangements);
}
