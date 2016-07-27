// Requires
var casper = require('casper').create();

// Settings
var start = 1;  // Start from x (NAMEx, EMAIL+x@domain.com)
var end = 20;  // Up to x, but not including (exclusive)
var country = 'BE';  // Country code (BE)
var dob = '1990-12-30';  // Date of birth, YYYY-mm-dd
var username = 'username';  // User- & display name. Make sure any "(username + number)@domain.com" is 100% unique.
var password = 'password';
var email_user = 'email-username';  // If your email is email@domain.com, enter "email"
var email_domain = 'hotmail.com';  // Domain of e-mail host

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

for(var i = start; i < end; i++) {
    console.log('[o] Starting ' + start + ' to ' + (end - 1) + '.');

    (function(ctr) {
        casper.thenOpen(url_ptc, function () {
            this.echo('[' + ctr + '] First Page: ' + this.getTitle());

            this.fill('form[name="verify-age"]', {
                'dob': dob,
                'country': country
            }, true);
        }).then(function () {
            this.echo('[' + ctr + '] Second Page: ' + this.getTitle());

            this.fill('form#user-signup-create-account-form', {
                'username': username + ctr,
                'password': password,
                'confirm_password': password,
                'email': email_user + '+' + ctr + '@' + email_domain,
                'confirm_email': email_user + '+' + ctr + '@' + email_domain,
                'screen_name': username + ctr,
                'terms': true
            }, true);
        }).then(function() {
            if(/Hello! Welcome/.test(this.getHTML())) {
                this.echo('[' + ctr + '] It worked!');
            } else {
                this.echo('[' + ctr + '] Failed :(');
            }
        });
    })(i);
}

casper.run();
