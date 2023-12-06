const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(`File read error: ${err.message}`);
    return;
  }
  data = data.split(/\r?\n/);
  let details = {};
  for (i in data) {
    let match = data[i]
      .match(/(?<=:\s+)\d.*/g)[0]
      .split(/\s/)
      .filter((element) => element.trim() !== "")
      .map(Number);
    let key = data[i].match(/\w*(?=:)/g)[0].toLowerCase();
    details[key] = match;
  }
  let acceleration = 1;
  let number_wins_arr = [];

  for (i = 0; i < details.time.length; i++) {
    let number_wins = 0;
    for (hold_time = 1; hold_time < details.time[i]; hold_time++) {
      velocity = hold_time * acceleration; // v = u + at where u = 0
      let total_distance = velocity * (details.time[i] - hold_time); // d = s * t
      if (total_distance > details.distance[i]) {
        number_wins += 1;
      }
    }
    number_wins_arr.push(number_wins);
  }

  console.log(`Number of wins for each race respectively: ${number_wins_arr}`);
  margin_of_error = number_wins_arr.reduce((a, b) => a * b, 1);
  console.log(`Margin of error is ${margin_of_error}`);
});
