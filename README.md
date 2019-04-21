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
