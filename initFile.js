const fs = require("fs");
const process = require("process");

// get the filename from the command line arguments
const fileName = process.argv[2];

if (!fileName) {
  console.error("Please specify a file name");
  process.exit(1);
}

// read the template file
const template = fs.readFileSync("template.js", "utf8");

// write the new file based on the template
fs.writeFileSync(`${fileName}.js`, template);
console.log(`${fileName}.js has been created`);
