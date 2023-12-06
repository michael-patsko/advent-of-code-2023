const fs = require("node:fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(`File read error: ${err.message}`);
    return;
  }
  data = data.split(/\r?\n/);
  let details = {};
  for (i in data) {
    let match = data[i].match(/(?<=:\s+)\d.*/g)[0].replace(/\s/g, "");
    match = parseInt(match, 10);
    let key = data[i].match(/\w*(?=:)/g)[0].toLowerCase();
    details[key] = match;
  }
  let acceleration = 1;

  let number_wins = 0;
  for (hold_time = 1; hold_time < details.time; hold_time++) {
    velocity = hold_time * acceleration; // v = u + at where u = 0
    let total_distance = velocity * (details.time - hold_time); // d = s * t
    if (total_distance > details.distance) {
      number_wins += 1;
    }
  }
  console.log(`Number of wins: ${number_wins}`);
});
