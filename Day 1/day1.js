const fs = require("node:fs");
let inputLines;

function reverseString(str) {
  return str.split("").reverse().join("");
}

// read input file
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // split input file at line breaks
  inputLines = data.split(/\r?\n/);
  let runningTotal = 0;

  // create an array that will be used to replace input values with their respective number
  const numberWords = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  inputLines.forEach((line) => {
    let chars;
    let charsReversed;
    let numberFirst;
    let numberLast;
    let calibrationValue;

    // create array of characters and the characters reversed
    chars = line.split("");
    charsReversed = chars.slice().reverse();

    // we want to march through the input line, and if at any point it contains any of numberWords, make that our output number

    // creates boolean isNumber that tests if an element doesn't return NaN when the Number() operator is applied
    const isNumber = (element) => !isNaN(Number(element));
    let tempString = "";
    let found = false;

    // loop through chars
    for (const character of chars) {
      if (isNumber(character)) {
        numberFirst = character;
        break;
      } else {
        tempString += character;
        numberWords.forEach((word) => {
          if (tempString.includes(word)) {
            numberFirst = String(
              numberWords.findIndex((element) => element == word) + 1
            );
            found = true;
          }
        });
      }
      if (found) break;
    }

    tempString = "";
    let tempStringReversed = "";
    found = false;

    // loop through charsReversed
    for (const character of charsReversed) {
      if (isNumber(character)) {
        numberLast = character;
        break;
      } else {
        tempString += character;
        tempStringReversed = reverseString(tempString);
        numberWords.forEach((word) => {
          if (tempStringReversed.includes(word)) {
            numberLast = String(
              numberWords.findIndex((element) => element == word) + 1
            );
            found = true;
          }
        });
      }
      if (found) break;
    }

    calibrationValue = Number([numberFirst, numberLast].join(""));
    runningTotal += calibrationValue;
  });
  console.log(runningTotal);
});
