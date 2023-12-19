let startTime = process.hrtime();
const fs = require("fs");

function readFileAndParse(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.split(/\n\s*\n/);
  let workflows = new Map();
  let parts = [];

  content[0]
    .split(/\r?\n/)
    .map((element) => element.trim())
    .forEach((line) => {
      let workflowName = line.match(/\w+(?={)/g)[0];
      let workflowSteps = line.match(/(?<={).+(?=})/g)[0].split(",");
      workflows.set(workflowName, workflowSteps);
    });

  content[1]
    .split(/\r?\n/)
    .map((element) => element.trim())
    .forEach((line) => {
      let partX = Number(line.match(/(?<=x\=)\d+/g)[0]);
      let partM = Number(line.match(/(?<=m\=)\d+/g)[0]);
      let partA = Number(line.match(/(?<=a\=)\d+/g)[0]);
      let partS = Number(line.match(/(?<=s\=)\d+/g)[0]);
      parts.push({
        x: partX,
        m: partM,
        a: partA,
        s: partS,
      });
    });
  return { workflows, parts };
}

function followWorkflows(workflows, parts) {
  const startingWorkflow = "in";
  let acceptedParts = [];

  parts.forEach((part) => {
    let processed = false;
    let currentWorkflow = workflows.get(startingWorkflow);
    let i = 0; // Don't forget to reset this to 0 when choosing a new workflow
    while (!processed) {
      let instruction = currentWorkflow[i]; // Start at first value in workflow
      if (instruction === "A") {
        acceptedParts.push(part);
        processed = true;
        continue;
      } else if (instruction === "R") {
        processed = true;
        continue;
      } else {
        // Main instruction code
        const [condition, outcome] = instruction.split(":");
        let [category, value] = condition.split(/[<>]/);
        value = Number(value);
        const result = undefined;

        // Determines if it involves less than or greater than
        if (condition.includes("<")) {
          if (part[category] < value) {
            // If A or R, process accordingly, otherwise go to next instruction
            if (outcome === "A") {
              acceptedParts.push(part);
              processed = true;
              continue;
            } else if (outcome === "R") {
              processed = true;
              continue;
            } else {
              currentWorkflow = workflows.get(outcome);
              i = 0;
              continue;
            }
          } else {
            i++;
            continue;
          }
        } else if (condition.includes(">")) {
          if (part[category] > value) {
            // If A or R, process accordingly, otherwise go to next instruction
            if (outcome === "A") {
              acceptedParts.push(part);
              processed = true;
              continue;
            } else if (outcome === "R") {
              processed = true;
              continue;
            } else {
              currentWorkflow = workflows.get(outcome);
              i = 0;
              continue;
            }
          } else {
            i++;
            continue;
          }
        } else {
          if (condition === "A") {
            acceptedParts.push(part);
            processed = true;
            continue;
          } else if (condition === "R") {
            processed = true;
            continue;
          } else {
            currentWorkflow = workflows.get(condition);
            i = 0;
            continue;
          }
        }
      }
    }
  });
  return acceptedParts;
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  const { workflows, parts } = readFileAndParse(filePath);

  const acceptedParts = followWorkflows(workflows, parts);
  console.log(acceptedParts);

  let total = 0;
  acceptedParts.forEach((part) => {
    let values = Object.values(part);
    total += values.reduce((a, b) => a + b, 0);
  });

  console.log(`Total:`, total);

  let diff = process.hrtime(startTime);
  let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
  console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
}

main("input");
