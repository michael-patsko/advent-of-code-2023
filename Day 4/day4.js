const fs = require("node:fs");

function compareNumbers(numbers_1, numbers_2) {
  let common_numbers = 0;
  for (let i = 0; i < numbers_1.length; i++) {
    for (let j = 0; j < numbers_2.length; j++) {
      if (numbers_1[i] === numbers_2[j]) common_numbers += 1;
    }
  }
  return common_numbers;
}

// read input file
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // code goes here
  let card_numbers = [];
  let winning_numbers = [];
  let numbers_owned = [];
  let card_points = [];
  data = data.split(/\r?\n/);
  data.forEach((element) => {
    // push card numbers to card_numbers array
    card_numbers.push(element.match(/(?<=Card\s+)\d+/g)[0]);

    // push winning numbers to winning_numbers array
    winning_numbers.push(
      element
        .match(/(?<=:\s+)\d.*\d(?=\s\|)/g)[0]
        .split(" ")
        .filter((item) => item !== "")
    );

    // push numbers you have to numbers_owned array
    numbers_owned.push(
      element
        .match(/(?<=\|\s).*/g)[0]
        .split(" ")
        .filter((item) => item !== "")
    );
  });
  for (let i = 0; i < card_numbers.length; i++) {
    let common_numbers = compareNumbers(winning_numbers[i], numbers_owned[i]);
    if (common_numbers !== 0) {
      card_points.push(Math.pow(2, common_numbers - 1));
    } else {
      card_points.push(0);
    }
  }
  let total = card_points.reduce((a, b) => a + b, 0);
  console.log(total);
});
