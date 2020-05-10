const express = require('express');
const R = require('ramda');

const projectMiddleware = require('../middlewares/projectMiddleware');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

const scopeMapping = {
    full: ['_id', 'name', 'email', 'phone'],
    default: ['_id', 'name'],
    email: ['_id', 'name', 'email'],
    phone: ['_id', 'name', 'phone']
}


router.route('/verifyproject')
    .get(projectMiddleware, async function (req, res) {
        if (req.project) {
            res.send(req.project);
        }
        else {
            res.status(400).send({ message: "Project does not exists" });
        }
    });

router.route('/userinfo')
    .get(projectMiddleware, authenticate, async function (req, res) {
        if (!req.project || req.project.projectSecret != req.query.projectSecret) {
            return res.status(400).send({ message: "Invalid Project Data" })
        }
        if (!req.user) {
            return res.status(400).send({ message: "Invalid Code" })
        }
        token = req.token;
        project = req.project;
        user = req.user;
        if (token.access != "oauth") {
            return res.status(400).send({ message: "The code does not have OAuth Access" });
        }
        if (token.projectID != project.projectID) {
            return res.status(400).send({ message: "Project ID does not match" })
        }
        if (token.projectSecret != project.projectSecret) {
            return res.status(400).send({ message: "Project Secret does not match" })
        }
        if (token.scope != project.scope) {
            return res.status(400).send({ message: "Project belongs to a different scope" })
        }
        res.send(R.pick(scopeMapping[project.scope], user))
    });

module.exports = router;
