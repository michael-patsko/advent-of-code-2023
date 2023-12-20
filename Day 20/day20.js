let startTime = process.hrtime();
const fs = require("fs");

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
  connections,
  states
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
      continue;
    }
  }
  return addToQueue;
}

function pressButton(types, connections, states, number = 1) {
  let totalLowPulses = 0;
  let totalHighPulses = 0;
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
      let addToQueue = sendPulse(
        destinations,
        pulseStrength,
        currentModule,
        types,
        connections,
        states
      );
      if (pulseStrength === "low") totalLowPulses += destinations.length;
      if (pulseStrength === "high") totalHighPulses += destinations.length;

      // Add to queue
      addToQueue.forEach((element) => queue.push(element));
    }
  }
  const pulsePower = totalLowPulses * totalHighPulses;
  return pulsePower;
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

  const pulsePower = pressButton(types, connections, states, 1000);
  console.log(pulsePower);
}

main("input");

let diff = process.hrtime(startTime);
let timeInMilliseconds = diff[0] * 1000 + diff[1] / 1000000;
console.log(`Execution time: ${timeInMilliseconds} milliseconds`);
