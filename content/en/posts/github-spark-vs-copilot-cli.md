+++
title = 'GitHub Spark vs. Copilot CLI: Making 3D Games'
date = 2026-04-12T19:20:24-04:00
draft = false
+++ 
 I recently started using a Copilot Pro subscription, mainly 
for the Copilot CLI harness, to integrate AI into some of my 
workflows. Then I noticed GitHub also has a tool called Spark
for generating web applications. Finally, I realized that 
having each generate a 3D game would make for a fun 
experiment.

## What Is GitHub Spark?
 GitHub Spark is a tool for developing web applications. The concept is pretty cool, 
allowing a user to enter a prompt and have a full application generated for them.
It even has a feature to save and deploy the application directory in the web interface.

## What Is Copilot CLI?
 Copilot CLI is an AI harness. It allows us to provide domain-specific knowledge via skill files, 
or completely modify agent behavior with customized markdown files.

## How They Were Judged
 I picked an existing game that I have fond memories of 
playing: "Geometry Wars." Then I gave each tool the same 
prompt to make me a game with a similar style. The winner was
the tool that gave me the most polished game.

## Which Tool Won
 This is not a rigorous benchmark, but from my experience, 
Copilot CLI appeared to be the clear winner. It took way less
prompting, and I only provided it context around general 
best practices for web technologies. It had several bugs 
around resetting game state, lack of mobile support, and 
issues with obstacles.
    
 GitHub Spark took about 20 prompts to even make the game models 
visible on the page. At one point it frustrated me enough 
that I threatened to fire it, but not even my threats managed
to make it resolve the issues.
    
 If you're wondering how good of a 3D game an AI can make in 
one shot, it is hosted at the moment at 
[poly.todoprogramming.org](https://poly.todoprogramming.org).

