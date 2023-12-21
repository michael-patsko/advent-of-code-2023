let startTime = process.hrtime();
const fs = require("fs");

// Modified this function to accept a line of text that will appear at the top of the file
function writeMatrixToFile(matrix, filePath, topText = "") {
  console.log(`\nWriting matrix to ${filePath}...`);
  const lines = matrix.map((row) => row.join(" "));

  let fileContent = lines.join("\n");
  fileContent = [topText, fileContent].join("\n");

  fs.writeFileSync(filePath, fileContent, "utf8");
}

function copyMatrix(matrix) {
  return matrix.map((row) => [...row]);
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.neighbours = [];
  }

  addNeighbour(node) {
    this.neighbours.push(node);
  }
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  return lines;
}

function createGraph(grid) {
  let nodes = {};
  let startNode;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[x][y] === ".") {
        let id = `${x},${y}`;
        nodes[id] = new Node(x, y);
      } else if (grid[x][y] === "S") {
        startNode = new Node(x, y);
        let id = `${x},${y}`;
        nodes[id] = startNode;
      }
    }
  }

  // Create edges between nodes
  for (let id in nodes) {
    let [x, y] = id.split(",").map(Number);
    let neighbours = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    neighbours.forEach(([nx, ny]) => {
      let neighbourID = `${nx},${ny}`;
      // If this neighbour is a valid node (it already exists inside nodes) add it to the neighbours of the node at ID
      if (nodes[neighbourID]) {
        nodes[id].addNeighbour(nodes[neighbourID]);
      }
    });
  }
  return { nodes, startNode };
}

function gardenWalk(startNode, distance) {
  // Use breadth-first search to determine where we can reach in EXACTLY 64 steps
  // Our queue will store current nodes, and the number of steps taken to reach that node

  // If our distance is even, we can reach nodes at even numbers of steps below 64
  // If our distance is odd, we can reach nodes at odd numbers of steps below 64
  let queue = [[startNode, 0]];
  let visited = new Set();
  let result = [];

  while (queue.length > 0) {
    let [node, steps] = queue.shift();

    if (steps % 2 === distance % 2) {
      result.push(node);
    }

    if (steps > distance) {
      break;
    }

    visited.add(node);

    node.neighbours.forEach((neighbour) => {
      if (!visited.has(neighbour)) {
        queue.push([neighbour, steps + 1]);
        visited.add(neighbour);
      }
    });
  }
  return result;
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  const lines = readFileAndParse(filePath);
  const result = createGraph(lines);
  const garden = result.nodes;
  const startPoint = result.startNode;

  const desiredDistance = 64;

  const reachablePlots = gardenWalk(startPoint, desiredDistance);

  let reachableGarden = lines.map((row) => row.split(""));
  reachablePlots.forEach((plot) => {
    let x = plot.x;
    let y = plot.y;
    reachableGarden[x][y] = "O";
  });

  console.log(
    `Number of plots reachable in ${desiredDistance} steps:`,
    reachablePlots.length
  );
  console.log("Garden height:", lines.length);
  console.log("Garden width:", lines[0].length);

  writeMatrixToFile(reachableGarden, "output.txt", `Steps: ${desiredDistance}`);
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
