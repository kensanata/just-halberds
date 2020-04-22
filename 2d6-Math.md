# Understanding 2d6 math

I need to understand the math behind 2d6 rolling and so I decided to
write it up in a way that does not require advanced math.

## The bell curve

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

Now, let's count how often the various sums show up. I like how the
numbers form diagonal "lines". Check out 7, for example: from the
bottom left to the top right. Anyway, here are the counts:

| 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:--:|:--:|:--:|
| 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 |  3 |  2 |  1 |

And this is the histogram:

![A triangle.](2d6-distribution.png)

## The odds of beating an opponent

What are the odds of beating your opponent, if you both roll +0? Let's
do another table. This time we're comparing the two 2d6 rolls. We'll
record how many such results we are seeing. That is, we multiply the
numbers from the table above: if we're comparing the result of 4 vs. 6
for example, we'll record 3×5=15, because of all the possible rolls
for the first two dice we're getting a four exactly three times, and
we're getting a six exactly five times. Once we have those numbers, we
can simply add up the numbers where one roll beats the other and
compare that to the total number of possible rolls: 6×6×6×6=1296.

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

Adding up the highlighted numbers: 576, thus the chances of beating
somebody else is 576:1296 or about 44%.

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

## Summary

OK, so now we know how to compute the odds of winning opposed 2d6
rolls taking into account a bonus difference: find the appropriate
triangle starting at the bottom-left and sum up all the numbers in
that triangle, and compare that to the total number (1296).

Why a bonus difference? If both add the same bonus, there's no effect.
All we care about is if one party is adding more than the other.

Here's the result:

|  +0 |  +1 |  +2 |  +3 |  +4 |  +5 |  +6 |  +7 |  +8 |    +9 |   +10 |  +11 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|:-----:|:----:|
| 44% | 56% | 66% | 76% | 84% | 90% | 95% | 97% | 99% | ≅100% | ≅100% | 100% |

You can verify this on anydice.com. If you enter `output 2d6+3 > 2d6`
and click on the *Calculate* button, this is the result:

| # |  %    |
|:-:|:-----:|
| 0 | 23.92 |
| 1 | 76.08 |

In the table above, that's 76%.
