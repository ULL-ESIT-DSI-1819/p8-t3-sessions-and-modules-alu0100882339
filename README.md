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
