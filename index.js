// Requires
var casper = require('casper').create({
    verbose: false,
    logLevel: "debug"
});
var nicknames = require('./nicknames.json');
var fs = require('fs');

// Settings
var start = 0; // Start from x (NAMEx, EMAIL+x@domain.com)
var end = 10;  // Up to x, but not including (exclusive)

var useNicknamesFile = false;        // Use nicknames file, or just append numbers to username?
var useRandomPassword = true;       // Generate a random password?

var outputFile = 'accounts.txt';        // File which will contain the generated "username password" combinations.
var outputFormat = '%NICK% %PASS%\r\n'; // Format used to save the account data in outputFile. Supports %NICK%, %PASS%.

var country = 'US';                 // Country code (BE, NL, FR, ...)
var dob = '1990-12-30';             // Date of birth, YYYY-mm-dd
var username = 'user';              // User- & display name. Make sure any "(username + number)@domain.com" is 100% unique.
var password = 'pass';              // Static password for all accounts. Ignored if useRandomPassword is true.
var email_user = 'email';           // If your email is email@domain.com, enter "email"
var email_domain = 'domain.com';   // Domain of e-mail host

// App data
var url_ptc = 'https://club.pokemon.com/us/pokemon-trainer-club/sign-up/';

// LETSAHGO
casper.start();

casper.on('complete.error', function(err) {
    this.echo("Complete callback has failed: " + err);
});

casper.on('error', function(msg, trace) {
    this.echo("Err: " + msg, "ERROR");
});

casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
});

console.log('[o] Starting ' + start + ' to ' + (end - 1) + '.');

for(var i = start; i < end; i++) {
    (function(ctr) {
        casper.thenOpen(url_ptc, handleDobPage.bind(casper, ctr)).then(handleSignupPage.bind(casper, ctr)).then(handleFinished.bind(casper, ctr));
    })(i);
}

casper.run();

function randomPassword() {
    return Math.random().toString(36).substr(2, 8);
}

// Pages
function handleDobPage(ctr) {
    this.echo('[' + ctr + '] First Page: ' + this.getTitle());
    
    this.fill('form[name="verify-age"]', {
        'dob': dob,
        'country': country
    }, true);
}

function handleSignupPage(ctr) {
    // Server sometimes messes up and redirects us to the verify-age page again
    if(this.exists('form[name="verify-age"]')) {
        this.echo('[' + ctr + '] Server is acting up. Retrying...');
        handleDobPage.call(this, ctr);
        this.then(handleSignupPage.bind(casper, ctr));
        return;
    }
    
    // OK we're on the right page
    var _pass = password;
    var _nick = username + ctr;

    var formdata = {
        'terms': true
    };

    this.echo('[' + ctr + '] Second Page: ' + this.getTitle());
    
    // Random password?
    if(useRandomPassword) {
         _pass = randomPassword();
    }
    
    // Use nicknames list, or (username + number) combo?
    if(useNicknamesFile) {
        // Make sure we have a nickname left
        if(nicknames.length < 1) {
            throw Error("We're out of nicknames to use!");
        }
        
        // Get the first nickname off the list & use it
        _nick = nicknames.shift();
        
        formdata['username'] = _nick;
        formdata['screen_name'] = _nick;
        formdata['email'] = email_user + '+' + _nick + '@' + email_domain;
        formdata['confirm_email'] = email_user + '+' + _nick + '@' + email_domain;
    } else {
        // Use username & counter
        formdata['username'] = _nick;
        formdata['screen_name'] = _nick;
        formdata['email'] = email_user + '+' + ctr + '@' + email_domain;
        formdata['confirm_email'] = email_user + '+' + ctr + '@' + email_domain;
    }

    // Log it in the file of used nicknames
    var content = outputFormat.replace('%NICK%', _nick).replace('%PASS%', _pass);
    fs.write(outputFile, content, 'a');
    
    formdata['password'] = _pass;
    formdata['confirm_password'] = _pass;
    
    // Fill & submit
    this.fill('form#user-signup-create-account-form', formdata, true);
}

function handleFinished(ctr) {
    this.echo('Finished ' + ctr + '.');
}