---
layout: post
title: "The game has changed: How I vibecoded my way into the #1 position on the Highload.fun leaderboard"
date: 2026-01-18 14:00:00 -0600
categories: blog
---

![Highload.fun Leaderboard](/images/highload/leaderboard.png)


*Yesterday, after 30 days of intense LLM and coding agent usage, I reached #1 on the [Highload.fun](https://highload.fun) leaderboard. To this day, I still don't know how to write a "hello world" in Rust, C++, Go, or (even less) Zig, but I'm now optimizing code alongside people who have been programming in C++ for decades. This is the story of how I got here.*

I've always loved programming, but never found the time to actually become a good programmer. I could write simple Python programs or JavaScript websites, but I never really shipped production-ready code. That all changed in 2022, when ChatGPT came out. Suddenly, years of accumulated knowledge about programming, systems design, architecture... got unlocked. I was no longer constrained by my coding skills (or lack thereof), and I started writing useful code.

I merged my first PR into our HFT system written in Clojure. I updated our secrets manager to add a salt to our keys. I won 4th place in a hackathon. I finally launched my correlations website. I built my own trading system from scratch that traded profitably. It was as if I had acquired superpowers.

Back in 2023, you still had to co-write the code (and fix ChatGPT's mistakes), so I mostly stuck to Python, JavaScript, and Clojure, languages I could read and that I was familiar with. But with the introduction of agents, and the improvements in the latest models, that all changed. Toward the end of last year, I realized I was no longer reading the code I was writing: either it was doing what I wanted it to do, or it wasn't, and I just had to prompt it again. So if the programming language got abstracted away, why not go with the best-performing language available: Rust.

So for Advent of Code 2025 I decided to solve it using Rust, and to solve all problems under 1 ms. That goal ended up being too ambitious at the time, and I settled for solving it in under 2 ms.

Project: [https://github.com/josusanmartin/advent-25](https://github.com/josusanmartin/advent-25)

![Advent of Code performance table](/images/highload/extracted/highload-01.png)

That was really fun, so I shared the project with some friends, and that's what changed everything. My good friend (and the best programmer I know), Matt Downey, sent me this message.

![Matt Downey message about Highload.fun](/images/highload/extracted/highload-02.png)

> Challenge accepted. Try it: [highload.fun/tasks/15](https://highload.fun/tasks/15)

[Highload.fun](https://highload.fun) is a website where high-performance programmers compete to solve trivial problems in the shortest amount of time. All the code is run on a server with the same hardware: a 2014 Intel Xeon CPU E3-1271 v3 @ 3.60GHz. You submit code that reads from STDIN and writes to STDOUT, and the platform measures how much CPU time your code spent. Solving the problem is trivial, but getting to #1 on the leaderboard requires a deep understanding of memory management, branching, parsing, cache misses, CPU gates...

![Highload.fun leaderboard screenshot](/images/highload/extracted/highload-03.png)

So, on December 18, 2025, I opened VS Code with Claude Code and Codex and got at it. My one-shot attempt for task 15 scored 195,157, landing me at position 68 out of 129 entries. Not bad, to be honest, but I wanted to get to number 1. I kept iterating and by the next day I was already at 35,753 and had made it to the top 10 on the leaderboard.

By December 23rd, I was already at number 4 on the leaderboard. But I had hit a wall. No matter how many micro-optimizations I tried, it seemed impossible to make any progress. I decided to switch to C++ at one point, and I gained a few microseconds with that.

[https://x.com/josusanmartin/status/2003485357443330106](https://x.com/josusanmartin/status/2003485357443330106)

![Tweet about reaching #4](/images/highload/extracted/highload-04.png)

I tried Claude Code, normal Claude, Codex, ChatGPT Pro, Gemini, Grok (the worst by far)... but I couldn't get sub 20k. Interestingly, the LLMs were stuck trying micro-optimizations and weren't able to take a step back and try to understand the problem. It took a lot of brainstorming, iterating, and learning how the lowest levels of the CPU work, but finally on December 28th it all came together and I broke the leaderboard.

![Submission history with top score](/images/highload/extracted/highload-05.png)

3,744!! My solution was almost 3x faster than the number 2 solution, 20x faster than the median score, and 200x faster than my first attempt. It took me more than 600 attempts to make it to the number 1 position on the leaderboard.

After that I just kept going. I currently hold the number 1 position on 6 different problems, and I'm in the top 10 on all but 3 of them. I also hold the first position on the global leaderboard, as well as the Rust, Go, and Zig leaderboards.

![Global leaderboard position](/images/highload/extracted/highload-06.png)
![Zig leaderboard position](/images/highload/extracted/highload-07.png)
![Rust leaderboard position](/images/highload/extracted/highload-08.png)
![Go leaderboard position](/images/highload/extracted/highload-09.png)


If you want to get a sense of the kind of problems we're up against, these are two great articles by Matt Stuchlik ([@s7nfo](https://x.com/s7nfo)):

- [Summing integers fast](https://blog.mattstuchlik.com/2024/07/12/summing-integers-fast.html)
- [Fastest memory read](https://blog.mattstuchlik.com/2024/07/21/fastest-memory-read.html)
