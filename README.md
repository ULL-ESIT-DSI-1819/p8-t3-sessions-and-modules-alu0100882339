# p8-t3-sessions-and-modules-alu0100882339

1) Creamos el módulo de auth.js, este módulo tiene una función a la cual le pasamos un objetoq ue nos ayudará a configurar los parametros de la autenticación.

```javascript
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

```

2) Dado que las credenciales de nuestros usuarios se guardarán en un fichero JSON, creamos el mismo en caso de que no exista

```javascript
if (!fs.existsSync(passwordFile))
		fs.writeFileSync(passwordFile, '{}');
```

3) Con auth nos aseguramos de que el usuario esté logueado antes de pasar al siguiente middleware

```javascript
const auth = function(req, res, next) {
		if(req.session && req.session.username && req.session.password){

			return next();
		}
		else {
			res.render(unauthorizedView);
			return res.sendStatus(401);
		}

	};
```

4) Creamos todos los métodos necesarios para que los usuarios puedan loguearse, registrarse, acceder a los contenidos y salir

```javascript
router.use('/content', auth, express.static(pathToProtect));

	router.get('/login', function(req, res){
		if( (!req.session.username)) {
			res.render(loginView);
		}

		else if ((req.session.username)) {
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
				return res.render(succesLoginView, {username:req.session.useranme});

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
```

5) Por último, devolvemos el objeto router

```javascript
return router;

```
