const express = require('express');
const R = require('ramda');

const { verifyAuthToken } = require('../middlewares/authenticate')
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
            res.header('x-auth', token).send(R.pick(['name'], user));

        }).catch(function(e) {
            console.log(e);
            res.status(400).send({ code: 400, message: e });
        });
    });

router.route('/login')
    .post(async function(req, res) {
        var body = R.pick(['email', 'password'], req.body);
        try {
            var user = await User.findByCredentials(body.email, body.password)
            var token = await user.generateAuthToken()
            res.header('x-auth', token).send(R.pick(['name'], user));
        } catch (e) {
            console.log(e);
            res.status(400).send({ code: 400, message: e });
        }
    });
router.route('/logout')
    .delete(verifyAuthToken, function(req, res) {
        req.user.removeToken(req.token).then(function() {
            res.send({ message: "Logout Successfull" });
        }).catch(function(e) {
            console.log(e);
            res.status(400).send({ code: 400, message: e });
        });
    });

module.exports = router;