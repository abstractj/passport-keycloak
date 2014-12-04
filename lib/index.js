/**
 * Module dependencies.
 */
var util = require('util'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  xtend = require('xtend'),
  request = require('request'),
  uuid = require('node-uuid');

/**
 * `Strategy` constructor.
 *
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  ['host',
    'realm',
    'clientID',
    'clientSecret',
    'callbackURL'].forEach(function (k) {
    if (!options[k]) {
      throw new Error(k + ' is required');
    }
  });


  this.options = xtend({}, options, {
    authorizationURL: 'http://' + options.host + '/auth/realms/' + options.realm + '/tokens/login',
    tokenURL:         'http://' + options.host + '/auth/realms/' + options.realm + '/tokens/access/codes',
    userInfoURL:      'http://' + options.host + '/auth/userinfo',
    apiUrl:           'http://' + options.host + '/auth/api'
  });


  this._base = Object.getPrototypeOf(Strategy.prototype);
  this._base.constructor.call(this, this.options, verify);

  this.name = 'Keycloak';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this.options.userInfoURL, accessToken, function (err, body) {
    if (err) { return done(err); }

    try {
      var json = JSON.parse(body);
      done(null, json);
    } catch (e) {
      done(e);
    }
  });
};

Strategy.prototype.authenticate = function (req, options) {
  if (req.query && req.query.error) {
    return this.fail(req.query.error);
  }
  this._base.authenticate.call(this, req, options);
};

Strategy.prototype.authorizationParams = function () {
  return {state: uuid.v4()};
};


Strategy.prototype._getAccessToken = function (done) {
  var body = {
    'client_id':     this.options.clientID,
    'client_secret': this.options.clientSecret,
    'type':          'web_server',
    'grant_type':    'client_credentials'
  };

  request.post({
    url: this.options.tokenURL,
    form: body
  }, function (err, resp, body) {

    if (err) {
      return done(err);
    }

    var result = JSON.parse(body),
      accessToken = result.access_token,
      idToken = result.id_token;
    done(null, accessToken, idToken);
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
