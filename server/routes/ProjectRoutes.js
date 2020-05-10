const express = require('express');
const crypto = require('crypto');
const R = require('ramda');

const Project = require('../models/project');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();
router.route('/')
	.post(authenticate, async function (req, res) {
		var data = R.pick(["name", "redirectURLs", "scope"],req.body);
		data.projectID = data.name.replace(/\s/g, '') + '.myapp.in';
		data.createdBy = req.user._id;
		const hash = crypto.createHmac('sha256', process.env.SECRET)
			.update(data.projectID)
			.digest('hex');
		data.projectSecret = hash;
		var project = new Project(data);
		try {
			var project = await project.save();
			res.send(R.pick(['name', 'projectID', 'projectSecret', 'redirectURLs', 'scope'], project));

		}
		catch (e) {
			res.status(406).send({ message: 'Retry with different name' });
		}

	})
	.get(authenticate, async function (req, res) {
		var project = await Project.find({ createdBy: req.user._id });
		res.send(project);
	})
	.delete(authenticate, async function (req, res) {
		try {
			var project = await Project.findOne({ _id: req.body._id, createdBy: req.user._id });
			if (project) {
				await project.remove();
				res.send({ message: "Deleted Successfully" });
			}
			else {
				res.status(401).send({ message: 'You are not authorised to delete this resource' });
			}
		}
		catch (e) {
			res.status(400).send();
		}
	});
router.route('/addRedirectUrl')
	.post(authenticate, async function (req, res) {
		var projectID = req.body.projectID;
		var redirectURL = req.body.redirectURL;
		try {
			var project = await Project.findOne({ projectID });
			if (project) {
				console.log(project.createdBy)
				console.log(req.user._id)
				if (project.createdBy.toHexString() != req.user._id.toHexString()) {
					return res.status(401).send({ message: 'You are not authorized to modify this project' });
				}
				project.redirectURLs.push(redirectURL);
				await project.save();
				res.send(R.pick(['name', 'projectID', 'projectSecret', 'redirectURLs', 'scope'], project));
			}
			else {
				res.status(400).send({ message: 'Invalid Project Id' });
			}
		}
		catch (e) {
			res.status(400).send();
		}
	})
module.exports = router;
