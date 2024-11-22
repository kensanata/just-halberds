# Understanding 2d6 math

I need to understand the math behind 2d6 rolling and so I decided to
write it up in a way that does not require advanced math.

## The distribution of 2d6

Let's start with a table with all the possible results of the two dice
and their sums.

|   | ⚀ | ⚁ | ⚂ | ⚃  | ⚄  | ⚅  |
|:-:|:-:|:-:|:-:|:--:|:--:|:--:|
| ⚀ | 2 | 3 | 4 | 5  | 6  | 7  |
| ⚁ | 3 | 4 | 5 | 6  | 7  | 8  |
| ⚂ | 4 | 5 | 6 | 7  | 8  | 9  |
| ⚃ | 5 | 6 | 7 | 8  | 9  | 10 |
| ⚄ | 6 | 7 | 8 | 9  | 10 | 11 |
| ⚅ | 7 | 8 | 9 | 10 | 11 | 12 | 

Now, let's count how often the various sums show up. Start with 2. How
many are there? Just one, in the top left corner. How many occurences
of 3? Two, also in the top left corner. How many occurences of 4?
Three. And so on. Let's put the numbers in a table showing the results
and the number of occurences for each.

![The 2d6 distribution](2d6-distribution.png){.right}

| 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:--:|:--:|:--:|
| 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3  | 2  | 1  |

The graph next to the table shows the distribution. Since we're only
rolling two dice, the famous bell curve is not visible. We get just a
triangle. 7 is the most likely result.

## The odds of reaching a target number

What are the odds of rolling a number or more? We can simply sum the
occurrences of all the results that satisfy our requirements and
compare that sum to total number of possible rolls: 6×6=36.

This is the same table as before. It shows the result of one person
rolling 2d6, and the occurrences of each result. Thus, to compute the
odds of rolling a 10 or more simply means adding up the highlighted
numbers. The sum is 6, thus the chances of rolling a 10 or higher is
6:36, i.e. 1:6 or about 17%.

| 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |  10 |  11 |  12 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:---:|:---:|:---:|
| 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 |  3¡ |  2¡ |  1¡ |

In Traveller, the target number is usually an 8, and people add their
difficulty modifier to it. For our purposes, we just subtract from the
target number. Thus, to determine the odds of rolling a 7 with 2d6 we
add up the highlighted numbers: 21:36, i.e. 7/12 or about 58%.

| 2 | 3 | 4 | 5 | 6 |  7 |  8 |  9 |  10 |  11 |  12 |
|:-:|:-:|:-:|:-:|:-:|:--:|:--:|:--:|:---:|:---:|:---:|
| 1 | 2 | 3 | 4 | 5 | 6¡ | 5¡ | 4¡ |  3¡ |  2¡ |  1¡ |

Actually, we can compute this for all the results and simply list our
chances of rolling a target number or more using 2d6:

|    2 |   3 |   4 |   5 |   6 |   7 |   8 |   9 |   10 |  11 |  12 | 13 |
|:----:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|:---:|:---:|:--:|
| 100% | 97% | 92% | 83% | 72% | 58% | 42% | 28% |  17% |  8% |  3% | 0% |

![2d6 vs. a target number](2d6-target.png){.right}

You can verify this on anydice.com. If you enter `loop N over
{2..13}{output 2d6 >= N named "Rolling [N] or higher"}` and click on
the *Calculate* button, you get two results for each target number: 0
are your chances of not making it, 1 are your chances of making it.

And this is the visualisation of the numbers above. As the target
number goes up, your chances go down. You're starting to see an
S-curve.

Conversely, the odds of rolling a target number or less using 2d6:

| 2  | 3  | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12   |
|:--:|:--:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:----:|
| 3% | 8% | 17% | 28% | 42% | 58% | 72% | 83% | 92% | 97% | 100% |

## The odds of beating an opponent

What are the odds of beating your opponent, if you both roll +0? Let's
do another table. This time we multiply the numbers from the table
above with how often they occur. If we're comparing the result of 4
vs. 6 for example, we'll record 3×5=15. A result 4 appears 3× and a
result of 6 appears 5×, so together they appear 15×. Once we have
these numbers, we add up the numbers where one roll beats the other
and compare the sum to the total number of possible rolls:
6×6×6×6=1296.

The table shows the results of two people rolling 2d6, in rows and
columns, respectively. Adding up the highlighted numbers: 576, thus
the chances of beating somebody else is 576:1296 or about 44%.

|    |   2  |   3  |   4  |   5  |   6  |   7  |   8  |   9  |  10  |  11  |  12 |
|:--:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:---:|
|  2 |   1  |   2  |   3  |   4  |   5  |   6  |   5  |   4  |   3  |   2  |   1 |
|  3 |   2¡ |   4  |   6  |   8  |  10  |  12  |  10  |   8  |   6  |   4  |   2 |
|  4 |   3¡ |   6¡ |   9  |  12  |  15  |  18  |  15  |  12  |   9  |   6  |   3 |
|  5 |   4¡ |   8¡ |  12¡ |  16  |  20  |  24  |  20  |  16  |  12  |   8  |   4 |
|  6 |   5¡ |  10¡ |  15¡ |  20¡ |  25  |  30  |  25  |  20  |  15  |  10  |   5 |
|  7 |   6¡ |  12¡ |  18¡ |  24¡ |  30¡ |  36  |  30  |  24  |  18  |  12  |   6 |
|  8 |   5¡ |  10¡ |  15¡ |  20¡ |  25¡ |  30¡ |  25  |  20  |  15  |  10  |   5 |
|  9 |   4¡ |   8¡ |  12¡ |  16¡ |  20¡ |  24¡ |  20¡ |  16  |  12  |   8  |   4 |
| 10 |   3¡ |   6¡ |   9¡ |  12¡ |  15¡ |  18¡ |  15¡ |  12¡ |   9  |   6  |   3 |
| 11 |   2¡ |   4¡ |   6¡ |   8¡ |  10¡ |  12¡ |  10¡ |   8¡ |   6¡ |   4  |   2 |
| 12 |   1¡ |   2¡ |   3¡ |   4¡ |   5¡ |   6¡ |   5¡ |   4¡ |   3¡ |   2¡ |   1 |

What if you have a +1 advantage? Just add one more diagonal:
576+146=722, so your odds are now 722:1296 or about 56%.

|    |   2  |   3  |   4  |   5  |   6  |   7  |   8  |   9  |  10  |  11  |  12  |
|:--:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
|  2 |   1¡ |   2  |   3  |   4  |   5  |   6  |   5  |   4  |   3  |   2  |   1  |
|  3 |   2¡ |   4¡ |   6  |   8  |  10  |  12  |  10  |   8  |   6  |   4  |   2  |
|  4 |   3¡ |   6¡ |   9¡ |  12  |  15  |  18  |  15  |  12  |   9  |   6  |   3  |
|  5 |   4¡ |   8¡ |  12¡ |  16¡ |  20  |  24  |  20  |  16  |  12  |   8  |   4  |
|  6 |   5¡ |  10¡ |  15¡ |  20¡ |  25¡ |  30  |  25  |  20  |  15  |  10  |   5  |
|  7 |   6¡ |  12¡ |  18¡ |  24¡ |  30¡ |  36¡ |  30  |  24  |  18  |  12  |   6  |
|  8 |   5¡ |  10¡ |  15¡ |  20¡ |  25¡ |  30¡ |  25¡ |  20  |  15  |  10  |   5  |
|  9 |   4¡ |   8¡ |  12¡ |  16¡ |  20¡ |  24¡ |  20¡ |  16¡ |  12  |   8  |   4  |
| 10 |   3¡ |   6¡ |   9¡ |  12¡ |  15¡ |  18¡ |  15¡ |  12¡ |   9¡ |   6  |   3  |
| 11 |   2¡ |   4¡ |   6¡ |   8¡ |  10¡ |  12¡ |  10¡ |   8¡ |   6¡ |   4¡ |   2  |
| 12 |   1¡ |   2¡ |   3¡ |   4¡ |   5¡ |   6¡ |   5¡ |   4¡ |   3¡ |   2¡ |   1¡ |

OK, so now we know how to compute the odds of winning opposed 2d6
rolls taking into account an advantage: find the appropriate triangle
starting at the bottom-left and sum up all the numbers in that
triangle, and compare that to the total number (1296).

Here's the result:

|  +0 |  +1 |  +2 |  +3 |  +4 |  +5 |  +6 |  +7 |  +8 |    +9 |   +10 |  +11 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|:-----:|:----:|
| 44% | 56% | 66% | 76% | 84% | 90% | 95% | 97% | 99% | 99.6% | 99.9% | 100% |

What about the reverse? When you have a penalty, the situation is
reversed: you can look up the chance of your opponent winning with
your penalty being their bonus. Thus, if your penalty is -1, their
chance of winning is 56%. Remember, however, that nobody wins when you
both get the same result. Therefore, your chance of winning with a
penalty is worse: it's 100-66=34%.

![2d6 + bonus vs. 2d6](2d6-beating.png){.right}

You can verify this on anydice.com. If you enter `loop N over
{-11..11}{output 2d6-2d6<N named "with modifier [N]"}` and click on the
*Calculate* button, you get two results for each target number: 0 are
your chances of not making it, 1 are your chances of making it.

And this is the visualisation of the numbers above. As the advantage
goes up, your chances go up.
