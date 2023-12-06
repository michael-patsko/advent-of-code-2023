const fs = require("node:fs");

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error(`File read error: ${err.message}`);
    return;
  }
  data = data.split(/\r?\n/);
  // code goes here
});
