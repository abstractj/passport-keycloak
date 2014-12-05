# Notice

This module was deprecated in favor of the work in progress here [https://github.com/keycloak/passport-keycloak](https://github.com/keycloak/passport-keycloak).

# Passport Keycloak adapter

Note: Most of the work done here was forked/adapted from [passport-auth0](https://github.com/auth0/passport-auth0.git).

## Instructions

1. `docker run -it -p 8080:8080 -p 9090:9090 jboss/keycloak`
2. Login on Keycloak
3. `git clone git@github.com:abstractj/passport-keycloak.git`
4. Import the realm file `goose-realm.json` available at `config` folder.
5. cd examples && npm install
6. Edit app.js file and change `host` to the `IP:port` where Keycloak is located. *Ex*: 10.0.1.9:8080
7. Run `npm app` at examples folder
8. Access `http://localhost:3000/callback`
