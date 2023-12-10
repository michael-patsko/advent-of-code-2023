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

function followDirections(node, nodes, directions) {
  let currentNode = node;
  console.log("Calculating steps and node order...");
  let steps = 0;

  while (!currentNode.endsWith("Z")) {
    for (let i = 0; i < directions.length; i++) {
      if (directions[i] === "L") {
        currentNode = nodes.get(currentNode)[0];
        steps += 1;
      } else if (directions[i] === "R") {
        currentNode = nodes.get(currentNode)[1];
        steps += 1;
      } else {
        throw new Error(`Invalid direction: ${directions[i]}`);
      }
    }
  }

  return steps;
}

// LCM algorithm taken from https://stackoverflow.com/questions/47047682/least-common-multiple-of-an-array-values-using-euclidean-algorithm
function LCM(arr) {
  const gcd = (a, b) => (a ? gcd(b % a, a) : b);
  const lcm = (a, b) => (a === 0 && b === 0 ? 1 : (a * b) / gcd(a, b));

  return arr.reduce(lcm);
}

const filePath = "input.txt";
const { nodes, directions } = readFileAndParse(filePath);
let startNodes = Array.from(nodes.keys()).filter(
  (element) => element[2] === "A"
);
let stepsArray = [];
startNodes.forEach((node) => {
  const steps = followDirections(node, nodes, directions);
  stepsArray.push(steps);

  console.log("\nSteps: ");
  console.log(steps);
});
console.log(`---\nMinimum steps across all: ${LCM(stepsArray)}`);
