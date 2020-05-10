const Project = require('../models/project');

var projectMiddle = function (req, res, next) {
	var projectID = req.query.projectID;
	var redirectURL = req.query.redirectURL;
	var scope = req.query.scope;
	Project.findOne({ projectID, redirectURLs: redirectURL, scope }).then(function (project) {
		req.project = project;
		next();
	}).catch(function (e) {
		res.sendStatus(500)
	});
};

module.exports = projectMiddle;