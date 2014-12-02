var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , KeycloakStrategy = require('../lib');

passport.use(new KeycloakStrategy({
       realm: 'goose-realm',
       host:       'keycloak.org',
       clientID:     'testid',
       clientSecret: 'testsecret',
       callbackURL:  '/callback'
       },
      function(accessToken, idToken, profile, done) {
        console.log("ahoy");
      })
)

var app = express();

// configure Express
app.set(function() {
  app.use(express.logger());
  // Initialize Passport!  Note: no need to use session middleware when each
  // request carries authentication credentials, as is the case with HTTP
  // Bearer.
  app.use(passport.initialize());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.listen(3000);
console.log("Starting the server");
