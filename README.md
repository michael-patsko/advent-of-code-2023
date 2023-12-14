# Notes on [Advent of Code 2023](https://adventofcode.com/2023)

###### By Michael Patsko

> :construction: **Work in Progress**: This README is currently under development. The content and structure will change as I continue to update it. Feel free to check back later when it's a little tidier. :smile:

---

## Table of Contents

- [Things Learned](#things-learned)
  
- [Things to Improve](#things-to-improve)
  
- [Preamble](#preamble)
  
- [Day 1: Trebuchet?!](#day-1-trebuchet)
  
- [Day 2: Cube Conundrum](#day-2-cube-conundrum)
  
- [Day 5: If You Give a Seed a Fertilizer](#day-5-if-you-give-a-seed-a-fertilizer)
  
- [Day 7: Camel Cards](#day-7-camel-cards)
  
- [Day 8: Haunted Wasteland](#day-8-haunted-wasteland)
  
- [Day 9: Mirage Maintenance](#day-9-mirage-maintenance)
  

---

## Things Learned

- spread operator: `...` - It expands elements of an iterable (like an array) into individual elements. For example:

```js
let obj = {
  A: 5,
  B: 7,
  C: 3
}
console.log(Math.max(...Object.values(obj)));
```

    would return `7`.

- Dynamic programming - reusing previously calculated states to save computation time.
  
- Frustrating subtle difference between `in` and `of` in JavaScript `for` loops. I had an error in my code at one point due to a misunderstanding in my use of `in` ; I had code that was formatted approximately as follows:
  

```js
function replaceAt(str, index, replacementChar) {
      ...
  }     // Function that replaces the character at a given index of
        // a string with another character
  for (let i in str) {
      str = replaceAt(str, i, "#");
  }
```

    I expected this code to replace the character at index `i` in the string with `#`. However, `i` was passed to `replaceAt` as a string, not a number, leading to an unexpected error that wasn't caught by JavaScript.

## Things to Improve

- In future attempts, I would like to use a more strongly typed language, such as TypeScript or Python.
  
- I need to improve the error handling in my code.
  
- Crediting borrowed code from the outset is important. In the early days, I might have used code from [Stack Overflow](https://stackoverflow.com/) without proper credit. See Day 2 `Array.min` and `Array.max` for an example. It's crucial to credit others for their contributions, regardless of the code's complexity.
  

## Reflections on my Approach

- My approach involved quickly writing code to find the correct answer, 
  without focusing on tidiness or optimization unless necessary.
  
- I opted to use JavaScript, not necessarily because it was the best language of choice for all puzzles, but because I find it easy to use for prototyping, and it proves suitable for most simple applications. Equally, it had been a while since I had done any challenging coding due to a period of illness, and so the ease of use and (broad amount?) of conversation around JavaScript and node.js online made it easy to jump back into.
  
- Similarly, my version control was very limited; my commits consist almost of exclusively of me adding an entire .js file for each part of the day's challenge, with a comment like `day 2 part 1 working solution`.
  

---

## Day 1: Trebuchet?!

### Part 1

This part involved taking a **calibration document** formatted as follows:

```txt
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
```

and parsing each line to find **calibration values**. The calibration values are found by taking the **first digit** and **last digit** of each line, and combining them to create the calibration value for that line. So in the case of line 1, the values `1` and `2` would be combined to give us a calibration value of `12`.

Finally, after retrieving a calibration value for each line in the document, (we?) had to find the **sum of all calibration values**, giving us the final answer. In the case of my input, the final answer turned out to be `56506`.

#### My Solution

For part 1, I started by splitting the input line by line using a [RegEx](https://en.wikipedia.org/wiki/Regular_expression) expression; `inputLines = data.split(/\r?\n/);`. If you're reading this document in order, you'll soon see that almost all solutions start this way. Then, I split each line into its constituent characters, and store both an array of these characters and their reverse. Finally, I run through each of these arrays until I find a number, and then concatenate them, giving me the calibration value for that line that I then add to a running total.

---

### Part 2

Part 2 introduced some additional complexity by allowing the alphabetic spelling of a number to be counted as a digit for a calibration value. This is better illustrated through an example; the calibration values for the lines

```txt
two1nine
eightwothree
abcone2threexyz
xtwone3four
```

are `29`, `83`, `13`, and `24` respectively.

#### My Solution

I tackled part 2 by introducing an array called `numberWords`, that stores the string representations of numbers. Then part 2 proceeds in mostly the same way as part 1, where I run through the character and reversed characters array element by element, except this time I implement a check to see if any substrings of the line match any of the strings stored in `numberWords`. If I find the string representation of a number, I simply retrieve its numeric value from `numberWords` and use this in my original calculation of the lines calibration value.

---

## Day 2: Cube Conundrum

### Part 1

For day 2, we're playing a game with an Elf, that involves working out the number of coloured cubes in a bag. Each time you play the game, the Elf hides a secret number of red, green, and blue cubes in the bag. Multiple times per game, the Elf reaches into the bag and shows you a random selection of cubes. Each game and its turns are recorded in your puzzle input as follows:

```txt
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
```

Each game is separated by a new line, and turns are separated by a semicolon `;`. From this list of information, we have to determine which games would have been possible if the bag was loaded with **12 red cubes, 13 green cubes, and 14 blue cubes**, and sum the **IDs** of those games.

From the puzzle brief:

> In the example above, **games 1, 2, and 5** would have been **possible** if the bag had been loaded with that configuration. However, **game 3** would have been **impossible** because at one point the Elf showed you 20 red cubes at once; similarly, **game 4 would also have been impossible** because the Elf showed you 15 blue cubes at once.

#### My Solution

---

### Part 2

#### My Solution

---

## Day 5: If You Give A Seed A Fertilizer

### Part 1

#### My Solution

Day 5 was challenging, requiring significant code optimisation, like replacing RegEx with string modification. I also forgot to commit my working solution to part 1. Oh well.

In part 2, I initially tried storing all seeds as calculated from their ranges, but this proved to be too memory-intensive, causing the program to terminate with an error for the larger input. Instead, I decided to store the ranges themselves, and modify my code to process them one-by-one, as calculated from their range. This saves storing all the seeds in memory. The solution still took a good few minutes to process though, so I set out on optimising it further.

---

## Day 7: Camel Cards

### Part 1

I began Day 7 by updating my template file to incorporate improvements learned from Day 5. This included changes such as using `camelCase` for my variable names, better separation of concerns into different variables, and removing some redundant error logging.

#### My Solution

This part proved to be more of a time-consuming puzzle than a particularly challenging one (though that's not to say it was easy by any means). The process of creating my solution ran almost entirely smoothly, with the exception of some trouble implementing the sorting function used to rank cards.

---

### Part 2

#### My Solution

This is where things began to take a turn. I tried implementing a `replaceJokers` function, which does pretty much what its name would imply. This turned out not to be so simple. I found myself manually calculating all possible combinations of Jokers in a hand and how to replace them in each scenario, eventually implementing this using a `switch` statement.

I'm certain this wasn't the most efficient, or the most clever, or the most appropriate way to solve this problem. Regardless, I eventually got it working and was able to log off for the day.

---

## Day 8: Haunted Wasteland

### Part 1

#### My Solution

---

### Part 2

#### My Solution

This involved finding the LCM (Lowest Common Multiple) of the times taken for each node to reach a node ending in Z. This idea actually came to me in the shower, although I initially had my doubts about it working. I started thinking, *won't I need to incorporate the time taken for each map to reach the start of a loop from its starting position*? I spent some time working on how to implement this solution, but eventually decided to just try implementing the LCM and seeing what happened. Frustratingly, this gave me the correct answer, however I'm still not convinced this is an appropriate solution for this problem in general. Rather, I think it is an appropriate solution for the inputs generated by AoC.

---

## Day 9: Mirage Maintenance

This problem involved finding zeros of what I've called **difference arrays** (effectively implementing some kind of differentiation).

### Part 1

#### My Solution

---

### Part 2

#### My Solution

---

## Day 10

### Part 1

Day 10 looked tricky straight off the bat.

#### My Solution

---

### Part 2

After just looking at the brief for part 2, and knowing the amount of time and effort put into my messy part 1 solution, I knew this was going to be a nasty one. So I decided instead to take a break, and use my time to start filling out some of this document for the days I'd missed.

It turned out to be a nightmare.

After I finally caved and looked at the subreddit, I saw that others had also tried the odd-even rule, to better results than me. I tried implementing the flood fill rule after seeing somebody's comment, only to then realise they had also doubled their grid resolution, something I wasn't prepared to work out how to do.

In the end I settled on Pick's theorem (again from the subreddit). This proved to not be too bad of an implementation actually, perhaps in thanks to my mathematical background. Aside from a little (hackery?) in getting my shoelace theorem `findArea`function to work (it kept returning negative so I simply took the absolute value), I finally got part 2 working. This was easily the hardest so far in my opinion.

#### My Solution

---