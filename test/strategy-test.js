var KeycloakStrategy = require('../lib');
var assert = require('assert');

describe('Keycloak strategy', function () {
  before(function () {
    this.strategy = new KeycloakStrategy({
       realm: 'goose-realm',
       host:       'keycloak.org',
       clientID:     'testid',
       clientSecret: 'testsecret',
       callbackURL:  '/callback'
      },
      function(accessToken, idToken, profile, done) {}
    );
  });

  it('authorizationURL should have the host', function () {
    this.strategy.options
      .authorizationURL.should.eql('https://keycloak.org/realms/goose-realm/tokens/login');
  });

  it('tokenURL should have the host', function () {
    this.strategy.options
      .tokenURL.should.eql('https://keycloak.org/realms/goose-realm/tokens/access/codes');
  });

  it('userInfoURL should have the host', function () {
    this.strategy.options
      .userInfoURL.should.eql('https://keycloak.org/userinfo');
  });

  describe('authorizationParams', function () {

    it('should map the connection field', function () {
      var extraParams = this.strategy.authorizationParams({connection: 'foo'});
      extraParams.connection.should.eql('foo');
    });

  });

  describe('authenticate', function () {
    it('when there is an error querystring propagate', function (done) {

      this.strategy.fail = function (challenge, status) {
        challenge.should.eql('host_mismatch');
        done();
      };

      this.strategy.authenticate({
        query: {
          error: 'host_mismatch'
        }
      });
    });
  });
});
