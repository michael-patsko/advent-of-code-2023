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

- [Day 14: Parabolic Reflector Dish](#day-14-parabolic-reflector-dish)

- [Day 18: Lavaduct Lagoon](#day-18-lavaduct-lagoon)

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

- In future attempts, I would like to use a more strongly typed language, such as TypeScript or Python :snake:.

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

The Elf poses a second question; in each game, what is the **fewest number of cubes** in the bag to make each game possible? For example, in our game 1 from earlier:

```txt
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
```

This game could have been played with as few as 4 red, 2 green, and 6 blue cubes.

Then, we define the **power** of a set of cubes as the value obtained by multiplying together the numbers of red, green, and blue cubes. In the case of the game above, we have **Power** = **4** \* **2** \* **6** = **48**. The final question we're posed is, what is the sum of the power of cubes across all games?

#### My Solution

---

## Day 5: If You Give A Seed A Fertilizer

### Part 1

#### My Solution

Day 5 was challenging, requiring significant code optimisation, like replacing RegEx with string modification. I also forgot to commit my working solution to part 1. Oh well. :shrug:

In part 2, I initially tried storing all seeds as calculated from their ranges, but this proved to be too memory-intensive, causing the program to terminate with an error for the larger input. Instead, I decided to store the ranges themselves, and modify my code to process them one-by-one, as calculated from their range. This saves storing all the seeds in memory. The solution still took a good few minutes to process though, so I set out on optimising it further.

---

## Day 7: Camel Cards

### Part 1

I began Day 7 by updating my template file to incorporate improvements learned from Day 5. This included changes such as using `camelCase`:camel: for my variable names, better separation of concerns into different variables, and removing some redundant error logging.

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

## Day 14: Parabolic Reflector Dish

On day 14, our input consists of a large grid of the characters `#`, `O`, and `.`, representing **square rocks**, **round rocks**, and **empty space** respectively. The grid as a whole represents a [parabolic reflector dish](https://en.wikipedia.org/wiki/Parabolic_reflector), with the rocks sitting on top. When the dish is tilted in a direction, the round rocks will roll, but the square rocks won't. For example:

```txt
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
```

After tilting this dish north, we are left with:

```txt
OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....
```

### Part 1

Part 1 tasks us with determining the load on the dish's north support beams, after the dish is tilted such that all the round rocks roll **north**. The amount of load exerted by a single round rock is equal to the number of rows from the rock to the south edge of the platform, including the row that the rock is on. So for the above example:

```txt
OOOO.#.O.. 10
OO..#....#  9
OO..O##..O  8
O..#.OO...  7
........#.  6
..#....#.#  5
..O..#.O.O  4
..O.......  3
#....###..  2
#....#....  1
```

Adding up these values, we're left with a total load of **136**.

#### My Solution

---

My solution to part 1 didn't involve anything particularly complex. First I split the input line by line, and then I split each line into it's constituent characters, giving me a matrix representation of the dish. Then I iterate through the matrix, stopping on square rocks, and searching below to find round rocks until I hit another square rock. Then I log the coordinates of this square rock and the count of rocks below in a `Map` object. If the square rock has no round rocks beneath, I simply ignore it and move on.

I suppose where my solution takes a bit of an unusual turn, is that instead of actually moving the rocks to their new positions, and then calculating their contribution based on their index, I derived a small formula that calculates the load from the indices of square rocks, and the number of rocks below them as calculated in my last function. For a square rock with vertical index $i$ and $n$ rocks beneath it, we have the formula:

$$
L = n \times (H - i - 1) - \sum_{k=1}^{n} k
$$

where $H$ is the height of our original matrix of rocks, and $L$ is the load exerted by these rocks on the north support. I've used [sigma notation](https://en.wikipedia.org/wiki/Summation) to represent the sum of integers from $1$ to $n$. Note that in the case of my code, we subtract $1$ from $H-i$, because I've added a layer of square rocks to the top of the matrix as part of my solution. Calculating $L$ for each square rock and totalling them we're left with our answer, which in the case of my input turned out to be **108813**.

### Part 2

For part 2, we're told that instead of just tilting the dish north, we'll tilt it **north**, then **west**, then **south**, then **east**. In fact, rather than just tilting the dish in this order once, we'll have these directions combine to form a **spin cycle**, which we will then repeat **1,000,000,000** times. After we've run the full spin cycle, *then* we calculate the load on the north beams.

#### My Solution

This is where I had to get a bit more clever. I started by adapting my functions for rolling the rocks north into functions for rolling the rocks east, south, and west. I definitely could've done this more tidily, probably adapting all 4 functions into a single function, but it was quicker and required less thought to just copy and paste the function a few times and change a few variables. Then I combined queued these 4 functions in another function called `spinCycle`, that would run those functions on the grid of rocks for some specified number of times, in our case 1,000,000,000.

I knew that actually running this cycle 1,000,000,000 times wasn't an option. Instead, I applied what I had learnt on Day 12, albeit in a much simpler way this time, to store previously seen states of the grid in a `Map`, alongside the number of cycles that had been run at that time. Then, when I encounter a state I've seen before, I can stop running spin cycles, and use the information from my `Map` to calculate what the grid would look like at 1,000,000,000 cycles. More specifically, I use the following formulae:

$$
\begin{align*}
R &= (N - S) \mod L \\
F &= S + R \\
\end{align*}
$$

where $R$ is the number of remaining cycles to reach the state at 1,000,000,000, $N$ is the total number of cycles, 1,000,000,000, $S$ is the number of cycles at the start of the loop, $L$ is the period of the loop in states, and $F$ is the cycle number we've previously encountered that corresponds to the state at cycle 1,000,000,000.

Once we've calculated $F$, we can simply look this value up in our map of stored states, giving us the state at cycle 1,000,000,000. Then we can calculate the load on the north supports, and this time we do so by using the vertical indices of the round rocks, rather than my formula from part 1.

---

## Day 18: Lavaduct Lagoon

Day 18's puzzle involves digging out a large area of land to serve as a lava lagoon:volcano:. Our input consists of a set of instructions that determine how we dig out this area. We're given a **dig plan** that looks something like the following:

```txt
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
```

For each line in our dig plan, we are given a **direction**, **distance**, and hexadecimal **colour code**. The directions are given from a birds eye view, so for example, `U` represents the direction pointing towards the top, or north of our land area. The distance is how far we will dig (in metres) in that direction before moving onto the next instruction, and the hexadecimal represents the colour that we will paint that section of lagoon edge.

### Part 1

In part 1, we're tasked with finding the volume of the lagoon dug out by these instructions. So for the above example dig plan, we first dig out the edge as follows:

```txt
#######
#.....#
###...#
..#...#
..#...#
###.###
#...#..
##..###
.#....#
.######
```

Then, we dig out the interior, giving us

```txt
#######
#######
#######
..#####
..#####
#######
#####..
#######
.######
.######
```

and a total volume of **62** cubic metres.

#### My Solution

For this puzzle, I started off by parsing the input into an array of objects, each containing the direction, distance, and colour code for that instruction. This allows me to easily follow the instructions in order, simply by iterating through the array. Then, starting at $[0,0]$, I follow the instructions one-by-one, adding each coordinate reached to a map of coordinates and their corresponding colour codes. Once I've obtained a list of all coordinates on the edge of the lagoon, I can use a combination of the [shoelace formula](https://en.wikipedia.org/wiki/Shoelace_formula) and [Pick's theorem](https://en.wikipedia.org/wiki/Pick%27s_theorem) (as I did on day 10) to give me the number of points contained by the coordinates on the edge of the lagoon. Then I simply add the number of points inside this edge to the number of points on the edge, giving me my final lagoon volume.

I also created a visualisation of the lagoon in a text file, similar to those shown in the examples, and this involved a slight reorientation of my coordinate system; moving the start point from $[0, 0]$ to a point elsewhere in the plane, such that my values for $x$ and $y$ never become negative. This doesn't affect any of the final values however, and the maths involved remains the same.

---

### Part 2

In part 2, we discover that somebody had accidentally swapped some details on the instructions, meaning we had been reading them incorrectly all along. It turns out the hexadecimal doesn't correspond to a colour, and instead it encodes the direction and distance for each instruction. On each line of the instructions, the **first five digits** of hexadecimal represent the distance once converted back to decimal, and the **last digit** corresponds to our direction; **0** to **R**, **1** to **D**, **2** to **L**, and **3** to **U**. With this knowledge, we can convert our dig plan to the true instructions, and it quickly becomes clear that our new lagoon is going to be much larger. For example, our original example input now becomes:

```txt
R 461937
D 56407
R 356671
D 863240
R 367720
D 266681
L 577262
U 829975
L 112010
D 829975
L 491645
U 686074
L 5411
U 500254
```

#### My Solution

Thankfully, this part 2 actually involved very little reworking. The main difference I had to make, was that instead of storing all edge points in memory and then calculating the total area using the shoelace formula, the updated area was calculated at the end of each instruction, saving massively on memory usage. Aside from this, the only other change that had to be made was how we parse the dig plan, but once these updates were made, I was able to run my code as before and obtain my answer. 

---

## Day 19
