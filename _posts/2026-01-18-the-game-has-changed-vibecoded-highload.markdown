---
layout: post
title: "The game has changed: How I vibecoded my way into the #1 position on the Highload.fun leaderboard"
date: 2025-12-29 09:00:00 -0600
categories: blog
---

To this day, I still don't know how to write a "hello word" in Rust, C++, Go or even less in Zig, but I'm now optimizing code at the level of people that have been programming in C++ for decades. The game has changed.

I've always loved programming, but never found the time to actually become a good programmer. So while I used to be able to write simple python programs, or javascript websites, I never really shipped any production ready code. That all changed in 2022 when ChatGPT came out. Suddenly, all the accumulated knowledge over years, about programming, systems design, architecture... got unlocked. I no longer was constrained but my coding skills, or lack thereof, and I started writing useful code.

I merged my first PR into our HFT system written in Clojure, I updated our secrets manager to add a salt to our keys, I won 4th place in a hackathon, I finally launched my correlations website, built my own trading system from scratch that traded profitably... It was as if I had acquired superpowers.

Back in 2023, you still had to co-write the code, and fix mistakes, from chatGPT, so I was mostly using Python, Javascript and Clojure; languages that I could read and that I was familiar with. But with the introduction of Agents, and the improvements with the latest models, that all changed. Towards the end of last year, I realized that I was no longer reading the code I was writing: Either the code was doing what I wanted it to do, or it wasn't, and I just had to prompt it again. So if the programming language got abstracted away, why not go with the best performing language available: Rust.

So for Advent of Code 2025 I decided to solve it using Rust, and to solve all problems under 1 ms. That goal ended up being too ambitious at the time, and I settled for solving it in under 2 ms.

[https://github.com/josusanmartin/advent-25](https://github.com/josusanmartin/advent-25)

![Advent of Code performance table](/images/highload/extracted/highload-01.png)

That was really fun, so I shared my project with some friends, and that's what changed everything. My good friend, and the best programmer I know, Matt Downey, sent me this message.

![Matt Downey message about Highload.fun](/images/highload/extracted/highload-02.png)

Challenge Accepted!

Highload.fun is this website where the best high performance programmers compete to solve trivial problems in the shortest amount of time. All the code is run on a server, with the same hardware: a 2014 Intel Xeon CPU E3-1271 v3 @ 3.60GHz. You submit the code that reads from STDIN and writes to STDOUT, and the platform measures how much CPU time your code spent. Solving the problem is trivial, but getting to #1 on the leaderboard requires a deep understanding of memory management, branching, parsing, cache misses, CPU gates...

![Highload.fun leaderboard screenshot](/images/highload/extracted/highload-03.png)

So, on December 18, 2025, I opened VS Code with Claude Code and Codex and got at it. The one-shot attempt for task 15 only scored 195,157 landing me on position 68 out of 129 entries. Not bad, to be honest, but I wanted to get to number 1. I kept iterating and by the next day I was already at 35,753 and I had made it to the top 10 on the leaderboard.

By December 23rd, I was already at number 4 on the leaderboard. But I had hit a wall. No matter how many micro-optimizations I tried, it seems impossible to make any progress. I decided to switch to C++ at some point, and I gained some microseconds with that.

[https://x.com/josusanmartin/status/2003485357443330106](https://x.com/josusanmartin/status/2003485357443330106)

![Tweet about reaching #4](/images/highload/extracted/highload-04.png)

I tried with Claude Code, normal Claude, Codex, chatGPT Pro, Gemini, Grok (the worst by far)... but I couldn't get sub 20k. Interestingly the LLMs were stuck trying micro-optimizations and they weren't able to take a step back and try to understand the problem. It took me a lot of brainstorming, iterating and getting to understand how the lowest levels of the CPU work, but finally on December 28th it all came together and broke the leaderboard.

![Submission history with top score](/images/highload/extracted/highload-05.png)

3,744!! My solution was almost 3x faster than the number 2 solution, 20x faster than the median score, and 200x faster than my first attempt. It had taken me more than 600 attempts to make it to the number 1 position on the leaderboard.

After that I just kept going. Now I currently hold the number #1 position on 6 different problems, and I'm in the top 10 in all but 3 of them. I also hold the first position on the global Leaderboard, as well as the Rust, Go and Zig leaderboards.

![Global leaderboard position](/images/highload/extracted/highload-06.png)
![Zig leaderboard position](/images/highload/extracted/highload-07.png)
![Rust leaderboard position](/images/highload/extracted/highload-08.png)
![Go leaderboard position](/images/highload/extracted/highload-09.png)

To this day, I still don't know how to write a "hello word" in Rust, C++, Go or even less in Zig, but I'm now optimizing code at the level of people that have been programming in C++ for decades. The game has changed.
