# Nintendo PTC Account Generator

An automation script based on CasperJS and PhantomJS that can create any number of Nintendo Pokémon Trainer Club accounts with a single  e-mail address. This only works because Nintendo doesn't check for "email+1@domain.com" e-mail tricks, where the e-mail host completely ignores any part after (and including) the plus sign and sends it to "email@domain.com".

This project was started as a proof of concept: even multi-billion dollar companies that just released the single most popular mobile game (Pokémon Go) sometimes miss the details.

More about plus signs in e-mail addresses [on StackExchange](http://security.stackexchange.com/questions/65244/what-are-the-security-reasons-for-disallowing-the-plus-sign-in-email-addresses).

## Requirements
* Node.js

## Installation & Usage
1. Install the required modules:
    ```$ npm install```
2. Open *index.js* and edit the settings at the top of the file.
3. Run the script:
    ```$ npm run start```