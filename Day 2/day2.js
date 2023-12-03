const fs = require("node:fs");

// modify arrays to take min and max operators
// taken from: https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

function findColourMax(colour, game) {
  let regex = new RegExp(`\\d+(?=\\s${colour})`, "g");
  return game.match(regex).map(Number).max();
}

// read input file
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // split input file at line breaks
  let games = data.split(/\r?\n/);
  let games_IDs = [];
  let red_nums = [];
  let green_nums = [];
  let blue_nums = [];
  let red_total = 12;
  let green_total = 13;
  let blue_total = 14;
  let power_total = 0;

  games.forEach((game) => {
    // push the ID number of each game to an array called games_IDs
    // push the count of each colour to an array for that colour per game
    games_IDs.push(Number(game.match(/(?<=Game\s)\d+(?=:)/g)));
    red_nums.push(findColourMax("red", game));
    green_nums.push(findColourMax("green", game));
    blue_nums.push(findColourMax("blue", game));
  });
  // check if the highest number of each colour shown is less than the given values
  // if they are, add the ID to a running total
  for (i = 0; i < games_IDs.length; i++) {
    power_total += red_nums[i] * green_nums[i] * blue_nums[i];
  }
  console.log(power_total);
});
