const fs = require("fs");

function readFileAndParse(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const handBids = new Map(); // map hands to their bids
  const handCounts = new Map(); // create counts of cards in case we have duplicates
  for (line of lines) {
    let hand = line.match(/\w+(?=\s\d)/g)[0];
    let bid = Number(line.match(/(?<=\w\s)\d+/g)[0]);
    handBids.set(hand, bid);
    if (handCounts.has(hand)) {
      let count = handCounts.get(hand);
      handCounts.set(hand, count + 1);
    } else {
      handCounts.set(hand, 1);
    }
  }
  return { handBids, handCounts };
}

function rankHands(handCounts) {
  // takes the handCounts map and returns an array of ranked hands, where a higher index corresponds to a higher ranking
  const handTypes = assignTypes(handCounts);
  const hands = Array.from(handTypes.keys());
  const handsRanked = hands.sort((handA, handB) =>
    compareHands(handA, handB, handTypes)
  );
  return handsRanked;
}

function assignTypes(handCounts) {
  // this is used to assign hands their type
  const types = ["11111", "2111", "221", "311", "32", "41", "5"];

  // 0 = High Card, 1 = One Pair, 2 = Two Pair, 3 = Three of a Kind, 4 = Full House, 5 = Four of a Kind, 6 = Full House
  const handTypes = new Map();
  handCounts.forEach((count, hand) => {
    console.log(`hand: ${hand}`);
    charCount = countCharacters(hand);
    let type = types.findIndex((element) => element === charCount);
    console.log(`Hand type: ${type}`);
    handTypes.set(hand, type);
  });
  return handTypes;
}

function compareHands(handA, handB, handTypes) {
  // this will be used to rank hands where they have the same type
  const cardRanks = [
    "J",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "Q",
    "K",
    "A",
  ];
  const typeA = handTypes.get(handA);
  const typeB = handTypes.get(handB);

  // first compare by type
  if (typeA !== typeB) {
    return typeA - typeB;
  }

  // if types are equal, compare card by card
  for (let i = 0; i < handA.length; i++) {
    // checks that cards aren't equal. if they are, we can move on to the next
    if (handA[i] !== handB[i]) {
      const indexA = cardRanks.findIndex((element) => element === handA[i]);
      const indexB = cardRanks.findIndex((element) => element === handB[i]);
      return indexA < indexB ? -1 : 1; // use a ternary to return -1 when A is smaller than B, and 1 for the converse
    }
  }
  return 0; // if the hands are totally equal
}

function countCharacters(str) {
  // counts the characters in a string and returns it as a string of counts

  let charCounts = str.split("").reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
  charCounts = replaceJokers(charCounts);
  let charString = Object.values(charCounts)
    .sort((a, b) => b - a)
    .join("")
    .toString(); // get string of counts for matching type
  console.log(
    `Jokers replaced. New charString: ${Object.keys(charCounts)
      .join("")
      .toString()}`
  );
  return charString;
}

function replaceJokers(charCounts) {
  // this function takes an object with the counts of cards in a hand, and distributes the jokers to create the most valuable hand
  const cardRanks = [
    "J",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "Q",
    "K",
    "A",
  ];
  const jokerCount = charCounts["J"];
  delete charCounts["J"];
  charsWithoutJ = Object.keys(charCounts).filter((key) => key !== "J");
  switch (jokerCount) {
    case 0:
      return charCounts; // no jokers to replace
    case 1:
      if (charsWithoutJ.length === 1) {
        let char = charsWithoutJ[0];
        return (charCounts = {
          [char]: 5,
        });
      } else if (charsWithoutJ.length === 4) {
        // give to highest value card using cardRanks.findIndex to get highest value card
        let char = charsWithoutJ.reduce((a, b) =>
          cardRanks.findIndex((element) => element === a) >
          cardRanks.findIndex((element) => element === b)
            ? a
            : b
        );
        charCounts[char] += jokerCount;
        return charCounts;
      } else if (charsWithoutJ.length === 3) {
        // give to highest count card
        let char = keysWithHighestValue(charCounts)[0];
        charCounts[char] += jokerCount;
        return charCounts;
      } else {
        let chars = keysWithHighestValue(charCounts);
        // add to character with highest count
        if (chars.length === 1) {
          let char = chars[0];
          charCounts[char] += jokerCount;
          return charCounts;
        } else {
          // find character with highest value and add joker to that
          let char = charsWithoutJ.reduce((a, b) =>
            cardRanks.findIndex((element) => element === a) >
            cardRanks.findIndex((element) => element === b)
              ? a
              : b
          );
          charCounts[char] += jokerCount;
          return charCounts;
        }
      }
    case 2:
      if (charsWithoutJ.length === 1) {
        let char = charsWithoutJ[0];
        return (charCounts = {
          [char]: 5,
        });
      } else if (charsWithoutJ.length === 4) {
        // give to highest value card using cardRanks.findIndex to get highest value card
        let char = charsWithoutJ.reduce((a, b) =>
          cardRanks.findIndex((element) => element === a) >
          cardRanks.findIndex((element) => element === b)
            ? a
            : b
        );
        charCounts[char] += jokerCount;
        return charCounts;
      } else {
        // give to highest count card
        let char = keysWithHighestValue(charCounts)[0];
        charCounts[char] += jokerCount;
        return charCounts;
      }
    case 3:
      if (charsWithoutJ.length === 1) {
        let char = charsWithoutJ[0];
        return (charCounts = {
          [char]: 5,
        });
      } else {
        // give to highest value card using cardRanks.findIndex to get highest value card
        let char = charsWithoutJ.reduce((a, b) =>
          cardRanks.findIndex((element) => element === a) >
          cardRanks.findIndex((element) => element === b)
            ? a
            : b
        );
        charCounts[char] += jokerCount;
        return charCounts;
      }
    case 4:
      let char = charsWithoutJ[0];
      return (charCounts = {
        [char]: 5,
      });
    case 5:
      charCounts = {
        A: 5,
      };
      return charCounts;
    default:
      return charCounts;
  }
}

function findWinnings(handsCounts) {
  const handsRanked = rankHands(handCounts);
  // takes an array of ranked hands and finds the corresponding winnings for each hand
  const winnings = [];
  for (hand of handsRanked) {
    const rank = handsRanked.findIndex((element) => element === hand) + 1;
    console.log(`Hand: ${hand} | Rank: ${rank}`);
    winnings.push(handBids.get(hand) * rank);
  }
  return winnings;
}

function keysWithHighestValue(obj) {
  // find the highest value in the object
  const maxValue = Math.max(...Object.values(obj));

  // find all keys with the highest value
  const keysWithMaxValue = Object.keys(obj).filter(
    (key) => obj[key] === maxValue
  );

  return keysWithMaxValue;
}

const filePath = "input.txt";
const { handBids, handCounts } = readFileAndParse(filePath);
const winnings = findWinnings(handCounts);
console.log(winnings);
console.log(`Total winnings: ${winnings.reduce((a, b) => a + b)}`);
