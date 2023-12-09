const fs = require("fs");

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const histories = content.split(/\r?\n/);
  return histories;
}

function predictNextValue(historyStr) {
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

  // now calculate the last values
  for (let i = differenceArrs.length - 1; i > 0; i--) {
    let lastIndex = differenceArrs[i].length - 1;
    let newValue =
      differenceArrs[i][lastIndex] + differenceArrs[i - 1][lastIndex];
    differenceArrs[i - 1].push(newValue);
  }

  // retrieve the predicted value from the final element of the first sequence array
  let predictedValue = differenceArrs[0][differenceArrs[0].length - 1];
  return { differenceArrs, predictedValue };
}

function main(histories) {
  let predictedValues = [];
  histories.forEach((history) => {
    let { differenceArrs, predictedValue } = predictNextValue(history);
    predictedValues.push(predictedValue);
  });
  console.log(predictedValues.reduce((a, b) => a + b, 0));
}

const filePath = "input.txt";
const histories = readFileAndParse(filePath);
main(histories);
