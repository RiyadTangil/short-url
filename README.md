### Answer of this question  ###
###  live link ###
https://short-url-gen-test.vercel.app/ 

### A brief explanation of your chosen data structure and approach to handling short
URL uniqueness.###
1. Random Generation 
Uses a 62-character set (a-z, A-Z, 0-9)
Generates a 6-character code by default
Provides 62^6 ≈ 56.8 billion possible combinations
Probability of collision is extremely low for small to medium-sized applications

2. Collision Detection and Resolution 
Before saving a new mapping, the system checks if the generated code already exists
If a collision is detected, a new code is generated
This process repeats up to 5 times to find a unique code
If no unique code is found after 5 attempts, an error is returned (extremely unlikely scenario)

 3. Database-Level Uniqueness

- The `shortCode` field is indexed with a unique constraint in MongoDB
- This provides an additional layer of protection against duplicate codes
- Even in a distributed environment with concurrent requests, the database ensures uniqueness


