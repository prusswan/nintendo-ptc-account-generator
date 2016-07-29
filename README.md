# Nintendo PTC Account Generator

An automation script based on CasperJS and PhantomJS that can create any number of Nintendo Pokémon Trainer Club accounts with a single  e-mail address. This only works because Nintendo doesn't check for "email+1@domain.com" e-mail tricks, where the e-mail host completely ignores any part after (and including) the plus sign and sends it to "email@domain.com".

This project was started as a proof of concept: even multi-billion dollar companies that just released the single most popular mobile game (Pokémon Go) sometimes miss the details.

More about plus signs in e-mail addresses [on StackExchange](http://security.stackexchange.com/questions/65244/what-are-the-security-reasons-for-disallowing-the-plus-sign-in-email-addresses).

## Requirements
### Prerequisites
* [Node.js](https://nodejs.org/en/)
* [PhantomJS 2.1.7+](http://phantomjs.org/)
* [CasperJS 1.1.3+](http://casperjs.org/)

The binary paths of all three prerequisites must be added to your OS' PATH environment variable, making `node -v`,
`phantomjs -v` and `casperjs --version` accessible from commandline.

## Usage
**Warning: The generator does not look for account names or e-mail addresses that are already in use.**
If the login is already in use, it will still store the login data in `outputFile`, even if it won't work.

1. Open [index.js](index.js) and edit the settings at the top of the file:
2. Run the script with CasperJS:
    `$ casperjs index.js`

## Configuration
### 1. Generate 10 accounts in the format USERx, where x is 0 to 9.
This example corresponds to the default settings. It will generate 10 accounts in the same format: user0, user1, ...

In [index.js](index.js):

    var start = 0;                      // Start from x (NAMEx, EMAIL+x@domain.com)
    var end = 10;                       // Up to x, but not including (exclusive)

    var useNicknamesFile = false;           // Use nicknames file, or just append numbers to username?
    var outputFile = 'accounts.txt';        // File which will contain the generated "username password" combinations.
    var outputFormat = '%NICK% %PASS%\r\n'; // Format used to save the account data in outputFile. Supports %NICK%, %PASS%.

### 2. Generate random passwords per account.
* Set `var useRandomPassword = true;` in [index.js](index.js).

### 3. Use a list of unique usernames instead of USERx combinations.
The list of unique usernames must be stored in [nicknames.json](nicknames.json). An example is available on the repo.

To create a number of accounts with custom usernames instead of user + number combinations, change [index.js](index.js):

    var useNicknamesFile = true;