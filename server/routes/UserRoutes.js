const express = require('express');
const R = require('ramda');

const authenticate = require('../middlewares/authenticate')
const projectMiddleware = require('../middlewares/projectMiddleware')
const User = require('../models/user');

const router = express.Router();

router.route('/register')
    .post(function(req, res) {

        var body = R.pick(['name', 'phone', 'email', 'password'], req.body);
        var user = new User(body);
        user.save().then(function() {
            return user.generateAuthToken();
        }).then(function(token) {
            res.header('x-auth', token).send(R.pick(['name', 'email', 'phone'], user));

        }).catch(function(e) {
            res.status(400).send(e);
        });
    });

router.route('/login')
    .post(async function(req, res) {
        var body = R.pick(['email', 'password'], req.body);
        try {
            var user = await User.findByCredentials(body.email, body.password)
            var token = await user.generateAuthToken()
            res.header('x-auth', token).send(R.pick(['name', 'email', 'phone'], user));
        } catch (e) {
            res.sendStatus(500);
        }


    });
router.route('/oauthCode')
    .get(projectMiddleware, authenticate, async function(req, res) {
        if (!req.project) {
            res.status(400).send({ message: 'Invalid Project Data' });
        }
        var code = await req.user.generateOAuthCode(req.project);
        redirectURL = `${req.query.redirectURL}?code=${code}`
        return res.send({ redirectURL });
    });
router.route('/logout')
    .delete(authenticate, function(req, res) {
        req.user.removeToken(req.token).then(function() {
            res.status(200).send({ message: "Logout Successfull" });
        }).catch(function(err) {
            res.status(400).send();
        });
    });

module.exports = router;