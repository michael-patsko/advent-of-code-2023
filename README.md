# Notes on Advent of Code 2023

> :construction: **Work in Progress**: This README is currently under development. The content and structure will change as I continue to update it. Feel free to check back later when it's a little tidier. :smile:

## Things Learned
spread operator: `...` - It is used to expand elements of an iterable (like an array) into individual elements. For example:
```js
let obj = { 
  A: 5, 
  B: 7, 
  C: 3 
}

console.log(Math.max(...Object.values(obj)));
```
would return `7`.

## Preamble
- I took the approach of initially just getting some code working to get the right answer. I wasn't focused on keeping it tidy or optimising it, unless the latter proved to be necessary.
- I opted to use JavaScript, not necessarily because it was the best language of choice for all puzzles, but because I find it easy to use for prototyping, and it proves suitable for most simple applications. Equally, it had been a while since I had done any challenging coding due to a period of illness, and so the ease of use and (broad amount?) of conversation around JavaScript and node.js online made it easy to jump back into.
- Similarly, my version control was very limited; my commits consist almost of exclusively of me adding an entire .js file for each part of the day's challenge, with a comment like `day 2 part 1 working solution`.

## Day 1: Trebuchet?!
### Part 1

This part involved taking a _calibration document_ formatted as follows:
```txt
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
```
and parsing each line to find _calibration values_. The calibration values are found by taking the first digit and last digit of each line, and concatenating them to create the calibration value for that line. So in the case of line 1, the values `1` and `2` would be combined to give us a calibration value of `12`.

Finally, after retrieving a calibration value for each line in the document, (we?) had to find the sum of all calibration values, giving us the final answer. In the case of my input, the final answer turned out to be `56506`.

---
#### My Solution

## Day 5: If You Give A Seed A Fertilizer
### Part 1

Day 5 gave me a lot of trouble, and required a lot of alterations to the way I had been working so far, in order to optimise my code. Such as changing RegExs for regular string modification. I also forgot to commit my working solution to part 1. Oh well.

In part 2 I initially tried storing all seeds as calculated from their ranges, but this proved to be too memory-intensive, causing the program to terminate with an error for the larger input. Instead, I decided to store the ranges themselves, and modify my processing code to process them one-by-one, as calculated from their range. This saves storing all the seeds in memory. The solution still took a good few minutes to process though, so I set out on optimising it further.

## Day 7: Camel Cards
### Part 1
This day began by me updating my template file (and by extension by beginnings of this puzzle) to incorporate some changes I'd made and better conventions I'd picked up when working on day 5. This included changes such as using `camelCase` for my variable names, better separation of concerns into different variables, and removing some redundant error logging.

---
#### My Solution
This part proved to be more of a time-consuming puzzle than a particularly challenging one (though that's not to say it was easy by any means). The process of creating my solution ran almost entirely smoothly, with the exception of some trouble implementing the sorting function used to rank cards.

### Part 2

---
#### My Solution
This is where things began to take a turn. I tried implementing a `replaceJokers` function, which does pretty much what its name would imply. This turned out not to be so simple. I found myself manually calculating all possible combinations of Jokers in a hand and how to replace them in each scenario, and implementing this using a `switch` statement.

I'm certain this wasn't the most efficient, or the most clever, or the most appropriate way to solve this problem. Regardless, I eventually got it working and was able to log off for the day.

## Day 8: Haunted Wasteland

Find LCM of periods of finding nodes, kinda annoying, shouldn't work to my understanding

## Day 9: Mirage Maintenance
easy, it's the one that involved finding zeros of difference arrays (effectively implementing some kind of differentiation)
### Part 1

---
#### My Solution

### Part 2

---
#### My Solution

## Day 10
### Part 1
Day 10 looked tricky straight off the bat.

---
#### My Solution

### Part 2
After just looking at the brief for part 2, and knowing the amount of time and effort put into my messy part 1 solution, I knew this was going to be a nasty one. So I decided instead to take a break, and use my time to start filling out some of this document for the days I'd missed.

It turned out to be a nightmare.

After I finally caved and looked at the subreddit, I saw that others had also tried the odd-even rule, to better results than me. I tried implementing the flood fill rule after seeing somebody's comment, only to then realise they had also doubled their grid resolution, something I wasn't prepared to work out how to do.

In the end I settled on Pick's theorem (again from the subreddit). This proved to not be too bad of an implementation actually, perhaps in thanks to my mathematical background. Aside from a little hackery in getting my shoelace theorem findArea function to work (it kept returning negative so I simply took the absolute value), I finally got part 2 working. This was easily the hardest so far in my opinion.

---
#### My Solution