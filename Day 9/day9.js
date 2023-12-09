const fs = require("fs");

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const histories = content.split(/\r?\n/);
  return histories;
}

function predictValues(historyStr) {
  const values = historyStr.split(/\s/g).map(Number);

  // initiate differenceArrs that will hold each layer of difference values
  let differenceArrs = [values];
  for (let j = 0; j < values.length; j++) {
    differenceArrs[j + 1] = [];
    for (let i = 0; i < differenceArrs[j].length - 1; i++) {
      let difference = differenceArrs[j][i + 1] - differenceArrs[j][i];
      differenceArrs[j + 1].push(difference);
    }
    if (differenceArrs[j + 1].every((element) => element === 0)) break; // all differences equal zero
  }
  // push a zero to the last array of differenceArrs
  let lastIndex = differenceArrs.length - 1;
  differenceArrs[lastIndex].push(0);

  // now calculate the predicted next values
  for (let i = differenceArrs.length - 1; i > 0; i--) {
    let lastIndex = differenceArrs[i].length - 1;
    let newValue =
      differenceArrs[i][lastIndex] + differenceArrs[i - 1][lastIndex];
    differenceArrs[i - 1].push(newValue);
  }

  differenceArrs[lastIndex].unshift(0);
  // calculate predicted previous value
  for (let i = differenceArrs.length - 1; i > 0; i--) {
    let newValue = differenceArrs[i - 1][0] - differenceArrs[i][0];
    differenceArrs[i - 1].unshift(newValue);
  }

  // retrieve the predicted next value from the final element of the first sequence array
  let predictedNextValue = differenceArrs[0][differenceArrs[0].length - 1];
  let predictedPreviousValue = differenceArrs[0][0];
  return { differenceArrs, predictedPreviousValue, predictedNextValue };
}

function main(histories) {
  let predictedPreviousValues = [];
  let predictedNextValues = [];
  histories.forEach((history) => {
    let { differenceArrs, predictedPreviousValue, predictedNextValue } =
      predictValues(history);
    predictedPreviousValues.push(predictedPreviousValue);
    predictedNextValues.push(predictedNextValue);
    // console.log(...differenceArrs);
  });
  console.log(
    `Sum of predicted previous values: ${predictedPreviousValues.reduce(
      (a, b) => a + b,
      0
    )}`
  );
}

const filePath = "input.txt";
const histories = readFileAndParse(filePath);
main(histories);
