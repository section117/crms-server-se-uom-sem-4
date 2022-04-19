const {app} = require('./app');
const port = process.env.PORT || 3000;

let appServer;

if (process.env.NODE_ENV === 'test') {
	appServer = app.listen(0, () => { });
} else {
	appServer = app.listen(port, () => {
		console.log(`Running on http://localhost:${port}`);
	});
}

module.exports = appServer;