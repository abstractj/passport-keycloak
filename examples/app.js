var express = require('express'),
  passport = require('passport'),
  util = require('util'),
  KeycloakStrategy = require('../lib');

passport.use(new KeycloakStrategy({
    realm: 'goose-realm',
    host:       '<insert your host here>',
    clientID:     'goose-passport-js',
    clientSecret: 'secret',
    callbackURL:  'http://localhost:3000/hello/'
  },
  function(accessToken, idToken, profile, done) {
    console.log('Keycloak strategy');
  })
);

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

app.get('/hello', function (req, res) {
  res.send('Ahoy!');
});

app.get('/error', function (req, res) {
  res.send('Error!');
});

app.get('/callback',
  passport.authenticate('Keycloak', { failureRedirect: '/error' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect('/hello');
  });

app.listen(3000);
console.log('Starting the server');
