const ip = require("ip");
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser =require('body-parser');
const auth = require('../../auth.js'); //debe ir lo del módulo ull-esit-dsi-1819/auth-alu0100882339 @alu0100882339
const path = require('path');
app.set('views', '../../views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : false}));

app.use(session({
	secret: 'verySecureSecret',
	resave: true,
	saveUninitialized: true
}));

app.use('/', auth({
	passwordFile: path.join(__dirname,'users.json'),
	pathToProtect: path.join(__dirname, "../../", 'dist'),
	registerView: 'register',
	successRegisterView: 'registerSuccess',
	errorRegisterView: 'registerError',
	loginView: 'login',
	successLoginView: 'loginSuccess',
	errorLoginView: 'loginError',
	logoutView: 'logout',
	unauthorizedView: 'unauthorizedView'
}));

app.get('/', function(req,res){
	res.render('index');

});

const server = app.listen(8080, '127.0.0.1', function () {

	const host = server.address().address;
	const port = server.address().port;

});
