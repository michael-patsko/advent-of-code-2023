const fs = require("fs");

function readFileAndParse(filePath) {
  // nodes will store a map of nodes and the nodes they lead to
  const nodes = new Map();
  console.log("Parsing file...");
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const directions = lines[0].split("");
  for (let i = 2; i < lines.length; i++) {
    let key = lines[i].match(/\w{3}(?=\s\=)/g)[0];
    let value = lines[i].match(/(?<=\=\s\().+(?=\))/g)[0].split(", ");
    nodes.set(key, value);
  }
  return { nodes, directions };
}

function followDirections(nodes, directions) {
  console.log("Calculating steps and node order...");
  let steps = 0;
  let currentNode = "AAA";
  let nodeOrder = ["AAA"];

  while (currentNode !== "ZZZ") {
    for (let i = 0; i < directions.length; i++) {
      if (directions[i] === "L") {
        currentNode = nodes.get(currentNode)[0];
        nodeOrder.push(currentNode);
        steps += 1;
      } else if (directions[i] === "R") {
        currentNode = nodes.get(currentNode)[1];
        nodeOrder.push(currentNode);
        steps += 1;
      } else {
        throw new Error(`Invalid direction: ${directions[i]}`);
      }
    }
  }

  return { nodeOrder, steps };
}

const filePath = "input.txt";
const { nodes, directions } = readFileAndParse(filePath);
const { nodeOrder, steps } = followDirections(nodes, directions);
console.log("\nSteps: ");
console.log(steps);
