const User= require('../models/user');
var authenticate = function(req,res,next){
	var token = req.header('x-auth')||req.query.code;
	User.findByToken(token).then(function(data){
		if(!data.user){
			return Promise.reject();	
		}
		req.user=data.user;
		req.token=data.token;
		next();
	}).catch(function(e){
		res.status(401).send();
	});

};

module.exports=authenticate;