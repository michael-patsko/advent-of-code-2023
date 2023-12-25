let startTime = process.hrtime();
const fs = require("fs");

class Position {
  constructor(x, y, z) {
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }
}

class Velocity {
  constructor(x, y, z) {
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }
}

function invertMatrix(A) {
  let a = A[0][0];
  let b = A[0][1];
  let c = A[1][0];
  let d = A[1][1];
  const det = a * d - b * c;
  if (det === 0) return null;

  const invDet = 1 / det;
  return [
    [d * invDet, -1 * b * invDet],
    [-1 * c * invDet, a * invDet],
  ];
}

function matrixMultiply(A, B) {
  return [A[0][0] * B[0] + A[0][1] * B[1], A[1][0] * B[0] + A[1][1] * B[1]];
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  let trajectories = new Map();
  let hailId = 0;
  lines.forEach((line) => {
    let [linePositions, lineVelocities] = line.split("@");
    linePositions = linePositions.split(",").map((element) => element.trim());
    lineVelocities = lineVelocities.split(",").map((element) => element.trim());
    let newPosition = new Position(
      linePositions[0],
      linePositions[1],
      linePositions[2]
    );
    let newVelocity = new Velocity(
      lineVelocities[0],
      lineVelocities[1],
      lineVelocities[2]
    );
    trajectories.set(hailId, { position: newPosition, velocity: newVelocity });
    hailId++;
  });
  return trajectories;
}

function checkIntersection(p1, v1, p2, v2) {
  // The intersection point can be found by solving the system of linear equations
  // vx1 * ta - vx2 * tb = x2 - x1
  // vy1 * ta - vy2 * tb = y2 - y1
  //
  // We will solve the system of equations using the matrix inverse method

  const x1 = p1.x;
  const vx1 = v1.x;

  const y1 = p1.y;
  const vy1 = v1.y;

  const x2 = p2.x;
  const vx2 = v2.x;

  const y2 = p2.y;
  const vy2 = v2.y;

  // Set up our matrices
  const A = [
    [vx1, -vx2],
    [vy1, -vy2],
  ];
  const B = [x2 - x1, y2 - y1];

  // Find inverse of A
  const invA = invertMatrix(A);
  if (invA === null) {
    return [];
  } else {
    const X = matrixMultiply(invA, B);
    const [ta, tb] = X;
    if (ta > 0 && tb > 0) {
      return [x1 + vx1 * ta, y1 + vy1 * ta];
    } else {
      return [];
    }
  }
}

function findIntersections(trajectories, lowerBound, upperBound) {
  let numIntersections = 0;

  // Get all combinations of trajectories
  for (let i = 0; i < trajectories.size; i++) {
    for (let k = i + 1; k < trajectories.size; k++) {
      let trajectory1 = trajectories.get(i);
      let trajectory2 = trajectories.get(k);

      // Set their positions and velocities to p1, v1, p2, v2
      let [p1, v1] = [trajectory1.position, trajectory1.velocity];
      let [p2, v2] = [trajectory2.position, trajectory2.velocity];

      // Straight lines will only ever intersect once (if at all)
      // Calculate intersection point
      // Check if t > 0 and x, y within test bounds
      // If so, add to successful intersections
      let intersectionPoint = checkIntersection(p1, v1, p2, v2);
      if (intersectionPoint.length > 0) {
        let newX = intersectionPoint[0];
        let newY = intersectionPoint[1];
        // Finally, check if x, y within test bounds
        if (
          newX >= lowerBound &&
          newX <= upperBound &&
          newY >= lowerBound &&
          newY <= upperBound
        ) {
          numIntersections++;
        }
      }
    }
  }
  return numIntersections;
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  const trajectories = readFileAndParse(filePath);
  const lowerBound = 200000000000000;
  const upperBound = 400000000000000;
  let numIntersections = findIntersections(
    trajectories,
    lowerBound,
    upperBound
  );
  console.log(numIntersections);
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
