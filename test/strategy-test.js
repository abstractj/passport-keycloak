var ScarecrowStrategy = require('../lib');
var assert = require('assert');

describe('Scarecrow strategy', function () {
  before(function () {
    this.strategy = new ScarecrowStrategy({
       realm: 'goose-realm',
       host:       'scarecrow.org',
       clientID:     'testid',
       clientSecret: 'testsecret',
       callbackURL:  '/callback'
      },
      function(accessToken, idToken, profile, done) {}
    );
  });

  it('authorizationURL should have the host', function () {
    this.strategy.options
      .authorizationURL.should.eql('http://scarecrow.org/auth/realms/goose-realm/tokens/login');
  });

  it('tokenURL should have the host', function () {
    this.strategy.options
      .tokenURL.should.eql('http://scarecrow.org/auth/realms/goose-realm/tokens/access/codes');
  });

  it('userInfoURL should have the host', function () {
    this.strategy.options
      .userInfoURL.should.eql('http://scarecrow.org/auth/userinfo');
  });

  describe('authorizationParams', function () {

    it('should map the state field', function () {
      this.strategy.authorizationParams().state.should.exist;
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
