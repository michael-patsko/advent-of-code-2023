let startTime = process.hrtime();
const fs = require("fs");

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const steps = content.split(",");
  return steps;
}

function hashAlgo(str) {
  let currentValue = 0;
  for (let i = 0; i < str.length; i++) {
    try {
      currentValue += str[i].charCodeAt(0);
    } catch (error) {
      throw new Error(`Invalid ASCII character: ${str[i]}`);
    }
    currentValue = currentValue * 17;
    currentValue = currentValue % 256;
  }
  return currentValue;
}

function checkForKey(map, mapKey, objectKey) {
  const array = map.get(mapKey);
  if (!array) {
    // No array for this key
    return false;
  }

  // Check if any object in the array has the objectKey
  return array.some((obj) => objectKey in obj);
}

function removeObjectWithKey(map, mapKey, objectKey) {
  let array = map.get(mapKey);
  if (!array) {
    // No array for this key
    return;
  }

  const index = array.findIndex((obj) => objectKey in obj);
  if (index !== -1) {
    // Remove the object if found
    array.splice(index, 1);
  }

  // Update the array in the map
  map.set(mapKey, array);
}

function updateObjectInArray(map, mapKey, objectKey, newValues) {
  let array = map.get(mapKey);
  if (!array) {
    // If there's no array for this key, create one
    array = [];
    map.set(mapKey, array);
  }

  let object = array.find((obj) => objectKey in obj);

  if (object) {
    // Update the object with new values
    object[objectKey] = newValues;
  } else {
    // Add a new object if it doesn't exist
    let newObj = {};
    newObj[objectKey] = newValues;
    array.push(newObj);
  }
}

function performArrangementProcedure(steps, log = false) {
  let boxes = new Map();

  for (let i = 0; i < 256; i++) {
    boxes.set(i, []);
  }

  for (let i = 0; i < steps.length; i++) {
    let str = steps[i];
    log && console.log(`Processing step: ${str}\n`);
    // For "-" steps
    if (str.includes("-")) {
      let label = str.match(/\w+(?=-)/)[0];
      let boxNumber = hashAlgo(label); // This gives us the number of box we need

      if (boxes.get(boxNumber).length === 0) {
        // Box contains no lenses
        continue;
      } else if (checkForKey(boxes, boxNumber, label)) {
        // Box contains a lens with this label
        // Remove object with that label from the array at boxes.get(boxNumber)
        removeObjectWithKey(boxes, boxNumber, label);
      } else {
        // Box does not contain a lens with this label
        log &&
          console.log(
            `Lens with label ${label} does not exist in box ${boxNumber}.`
          );
      }
      // For "=" steps
    } else if (str.includes("=")) {
      let label = str.match(/\w+(?=\=)/)[0];
      let boxNumber = hashAlgo(label);
      let focalLength = str.match(/(?<=\=)\d/)[0];
      focalLength = Number(focalLength);

      updateObjectInArray(boxes, boxNumber, label, focalLength);
    } else {
      throw new Error(`Invalid initialisation step:`, str);
    }
    // Log the state of the boxes after each step
    boxes.forEach((lenses, boxNumber) => {
      if (lenses.length !== 0) {
        log && console.log(`Box ${boxNumber}:`, ...lenses);
      }
    });
    log && console.log("-----");
  }
  return boxes;
}

function findFocusingPowers(boxes) {
  let focusingPowers = new Map();
  for (let boxNumber = 0; boxNumber < 256; boxNumber++) {
    let lenses = boxes.get(boxNumber);
    for (let j = 0; j < lenses.length; j++) {
      let lens = lenses[j];
      for (let [label, focalLength] of Object.entries(lens)) {
        let focusingPower = focalLength * (j + 1) * (boxNumber + 1);
        focusingPowers.set(label, focusingPower);
      }
    }
  }
  return focusingPowers;
}

function main(fileName) {
  const filePath = `${fileName}.txt`;
  const steps = readFileAndParse(filePath);

  const boxes = performArrangementProcedure(steps, false);
  const focusingPowers = findFocusingPowers(boxes);

  // console.log(`Focusing powers of each lens are: `, ...focusingPowers);
  // console.log("-----");

  let totalFocusingPower = Array.from(focusingPowers.values()).reduce(
    (a, b) => a + b,
    0
  );
  console.log(`Total focusing power of lenses is:`, totalFocusingPower);
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
