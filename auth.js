const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);
const express = require('express');
const router = express.Router();

module.exports = function(options) {

	const {
		passwordFile,
		pathToProtect,
		registerView,
		successRegisterView,
		errorRegisterView,
		loginView,
		successLoginView,
		errorLoginView,
		logoutView,
		unauthorizedView
	
	} = options;

	if (!fs.existsSync(passwordFile))
		fs.writeFileSync(passwordFile, '{}');

	const auth = function(req, res, next) {
		if(req.session && req.session.username && req.session.password){
		
			return next();
		}
		else {
			res.render(unauthorizedView);
			return res.sendStatus(401);
		}
	
	};

	router.use('/content', auth, express.static(pathToProtect));

	router.get('/login', function(req, res){
		if( (!req.session.username)) {
			res.render(loginView);
		}

		else if ((req.session.username)) { //no hace falta
			res.render(successLoginView, {username:req.session.username});
		}
	
	});

	router.post('/login', function(req, res) {
		let configFile = fs.readFileSync(passwordFile);
		let config = JSON.parse(configFile);

		let p = config[req.body.username];
		
		if(p) {
		
			if(( req.session) && req.body && req.body.password && (bcrypt.compareSync(req.body.password, p))){
				req.session.username = req.body.username;
				req.session.password = req.body.password;
				req.session.admin = true;
				return res.render(successLoginView, {username:req.session.useranme});
			
			}
			else return res.render(errorLoginView);
		}

		else return res.render(errorLoginView);
	
	});

	router.get('/register', function(req,res) {
		if((!req.session.username)){
			res.render(registerView);
		}

		else {
			res.render(successLoginView, {username:req.session.username});
		}
	});

	router.post('/register', function(req, res) {
		let configFile = fs.readFileSync(passwordFile);
		let config = JSON.parse(configFile);

		let p = config[req.body.username];

		if(!p)
			config[req.body.username] = bcrypt.hashSync(req.body.password, salt);
		else
			return res.render(errorRegisterView, req.body.username);

		let configJSON = JSON.stringify(config);
		fs.writeFileSync(passwordFile, configJSON);
		res.render(succesRegisterView, {useranme:req.body.username});
	
	});


	router.get('/logout', function(req,res){
		let user = req.session.username;
		req.session.destroy();
		res.render(logoutView, {user});
	
	});

	return router;
};
