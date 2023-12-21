let startTime = process.hrtime();
const fs = require("fs");

// LCM algorithm taken from https://stackoverflow.com/questions/47047682/least-common-multiple-of-an-array-values-using-euclidean-algorithm
function LCM(arr) {
  const gcd = (a, b) => (a ? gcd(b % a, a) : b);
  const lcm = (a, b) => (a === 0 && b === 0 ? 1 : (a * b) / gcd(a, b));

  return arr.reduce(lcm);
}

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const types = new Map();
  const connections = new Map();

  lines.forEach((line) => {
    let name;
    let type;
    let destinations;
    if (line.includes("broadcaster")) {
      name = line.match(/\w+(?=\s->)/g)[0];
      type = name;
      destinations = line
        .match(/(?<=->\s).+/g)[0]
        .split(",")
        .map((element) => element.trim());
    } else {
      type = line.match(/[&%](?=\w+\s->)/g)[0];
      name = line.match(/\w+(?=\s->)/g)[0];
      destinations = line
        .match(/(?<=->\s).+/g)[0]
        .split(",")
        .map((element) => element.trim());
    }
    types.set(name, type);
    connections.set(name, destinations);
  });

  return { types, connections };
}

function sendPulse(
  destinations,
  pulseStrength,
  inputModule,
  types,
  states,
  buttonPress
) {
  // This will hold future queue elements in the form `currentModule,pulseStrength`
  let addToQueue = [];
  for (let i = 0; i < destinations.length; i++) {
    let module = destinations[i];
    let type = types.get(module);
    let state = states.get(module);

    if (type === "&") {
      // Handle conjunction modules
      // They remember the most recent pulse recevied from each of their inputs
      // If all high, it sends a low pulse. Otherwise, it sends a high pulse
      // In the case of conjunction modules, their state is a map from their inputs to the last pulse received
      state.set(inputModule, pulseStrength);
      if (Array.from(state.values()).every((element) => element === "high")) {
        addToQueue.push(`${module},low`);
      } else {
        addToQueue.push(`${module},high`);
      }
    } else if (type === "%") {
      // Handle on/off switches, if they receive a high pulse, nothing happens
      // If they receive a low pulse, it toggles between on/off
      // If off -> on: send high, if on -> off: send low
      if (pulseStrength === "high") {
        continue;
      } else if (pulseStrength === "low") {
        if (state === "off") {
          addToQueue.push(`${module},high`);
          states.set(module, "on");
        } else if (state === "on") {
          addToQueue.push(`${module},low`);
          states.set(module, "off");
        } else {
          throw new Error(`Invalid state for ${module}: ${state}`);
        }
      } else {
        // Invalid pulse strength
        throw new Error(`Invalid pulse strength: ${pulseStrength}`);
      }
    } else {
      // This corresponds to the module 'rx'
      if (pulseStrength === "high") {
        continue;
      } else {
        console.log(`Button presses: ${buttonPress + 1}`);
      }
    }
  }
  return addToQueue;
}

function pressButton(types, connections, states, number = 1) {
  let totalLowPulses = 0;
  let totalHighPulses = 0;
  let buttonPressValues = [];
  for (let n = 0; n < number; n++) {
    totalLowPulses += 1; // Push the button
    let currentModule = "broadcaster";
    let pulseStrength = "low";
    let queue = [`${currentModule},${pulseStrength}`];
    while (queue.length > 0) {
      // Retrieve next value in queue
      [currentModule, pulseStrength] = queue[0].split(",");
      let destinations = connections.get(currentModule);

      // Remove value from queue
      queue.shift();

      // Send the pulse, and receive number of low and high pulses sent, as well as new values to add to queue

      // Looks for button press values when any of these 4 modules fire high
      // If these all fire high, then hp fires low into rx, giving us our answer
      // Find the button press values and their LCM, giving us our value
      if (
        (currentModule === "sn" ||
          currentModule === "sr" ||
          currentModule === "rf" ||
          currentModule === "vq") &&
        pulseStrength === "high"
      )
        buttonPressValues.push(n + 1);

      let addToQueue = sendPulse(
        destinations,
        pulseStrength,
        currentModule,
        types,
        states,
        n
      );
      if (pulseStrength === "low") totalLowPulses += destinations.length;
      if (pulseStrength === "high") totalHighPulses += destinations.length;

      // Add to queue
      addToQueue.forEach((element) => queue.push(element));
    }
  }
  const pulsePower = totalLowPulses * totalHighPulses;
  return { pulsePower, buttonPressValues };
}

function main(fileName) {
  const filePath = `${fileName}.txt`;

  // Create maps of names to their types, and names to their connections
  const { types, connections } = readFileAndParse(filePath);

  // Create map that will hold the state of modules, initialise this map
  let states = new Map();
  types.forEach((type, name) => {
    if (type === "%") {
      states.set(name, "off");
    } else if (type === "&") {
      // Find all keys in connections such that connections.get(key) === name
      // The number of keys is the number of inputs this module has
      // Create a map of keys -> low
      // Then when we update state later, we can use (types.get(name)).set to change state
      // Check if they are all high using (Array.from((types.get(name)).entries)).every === "high"
      let inputs = new Map();
      connections.forEach((connection, key) => {
        if (connection.includes(name)) inputs.set(key, "low");
      });
      states.set(name, inputs);
    } else {
      states.set(name, "low");
    }
  });

  let { pulsePower, buttonPressValues } = pressButton(
    types,
    connections,
    states,
    10000
  );
  // I'm being lazy below and just taking the first 4 values that our found,
  // without regard for the fact that one of the modules could fire more than once
  // in the time it takes for another to fire. But hey, it works.
  buttonPressValues = buttonPressValues.splice(0, 4);
  console.log(`Pulse power:`, pulsePower);
  console.log(`rx will fire at: `, LCM(buttonPressValues));
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
