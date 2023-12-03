const { syncDb } = require("./lib/function.js");
const { Main, app } = require("./index.js");
const conn = require("./config/config.json");
const port = conn.srv.port;

async function startWeb() {
	console.log("starting server...");
	await console.log("starting database");
	await syncDb();
	setTimeout(() => {
		app.listen(port, (req, res) => {
			console.log(`server running in PORT: ${port}`);
		});
	Main();
	}, 1000);
}
startWeb()

module.exports = { startWeb };
