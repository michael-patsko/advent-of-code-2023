const fs = require("fs");

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  let mode = "";
  let seedRanges = []; // store ranges instead of individual seeds
  let maps = {};

  lines.forEach((line) => {
    if (line.includes("map:")) {
      mode = line.split(":")[0].trim();
      maps[mode] = [];
    } else if (line.startsWith("seeds:")) {
      const rangeData = line.split(":")[1].trim().split(" ").map(Number);
      for (let i = 0; i < rangeData.length; i += 2) {
        seedRanges.push({ start: rangeData[i], length: rangeData[i + 1] });
      }
      console.log(`Seed ranges found: ${JSON.stringify(seedRanges)}`);
    } else if (line.trim() !== "") {
      const parts = line.trim().split(" ").map(Number);
      maps[mode].push({
        destStart: parts[0],
        srcStart: parts[1],
        length: parts[2],
      });
    }
  });

  console.log(`Maps parsed successfully.`);
  return { seedRanges, maps };
}

function processSeedRange(seedRange, maps) {
  let lowestLocation = Infinity; // initialise lowestLocation

  for (let i = 0; i < seedRange.length; i++) {
    let seed = seedRange.start + i;
    let location = findLocationForSeed(seed, maps);
    lowestLocation = Math.min(lowestLocation, location);
    if (i >= seedRange.length) break; // stop if the range is complete
  }
  console.log(`Lowest location found: ${lowestLocation}`);
  return lowestLocation;
}

function findLocationForSeed(seed, maps) {
  let soil = mapNumber(seed, maps["seed-to-soil map"]);
  let fertilizer = mapNumber(soil, maps["soil-to-fertilizer map"]);
  let water = mapNumber(fertilizer, maps["fertilizer-to-water map"]);
  let light = mapNumber(water, maps["water-to-light map"]);
  let temperature = mapNumber(light, maps["light-to-temperature map"]);
  let humidity = mapNumber(temperature, maps["temperature-to-humidity map"]);
  let location = mapNumber(humidity, maps["humidity-to-location map"]);
  return location;
}

function mapNumber(source, map) {
  for (let i = 0; i < map.length; i++) {
    let { destStart, srcStart, length } = map[i];
    if (source >= srcStart && source < srcStart + length) {
      return destStart + (source - srcStart);
    }
  }
  return source; // if not in map, return the source number itself
}

function findLowestLocationOverall(seedRanges, maps) {
  let overallLowest = Infinity; // initialise overallLowest

  for (let range of seedRanges) {
    let lowestInThisRange = processSeedRange(range, maps);
    overallLowest = Math.min(overallLowest, lowestInThisRange);
  }
  return overallLowest;
}

const filePath = "input.txt";
const { seedRanges, maps } = readFileAndParse(filePath);
console.log(
  `Overall lowest location is: ${findLowestLocationOverall(seedRanges, maps)}`
);
