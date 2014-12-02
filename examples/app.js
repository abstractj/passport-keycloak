var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , KeycloakStrategy = require('../lib');

passport.use(new KeycloakStrategy({
       realm: 'goose-realm',
       host:       '10.0.1.9:8080',
       clientID:     'goose-passport-js',
       clientSecret: '09a0d375-5930-4b9c-bd55-e5c02c6e9609',
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

app.get('/callback',
  passport.authenticate('Keycloak', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/user");
  });

app.listen(3000);
console.log("Starting the server");
