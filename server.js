const log = console.log;

const { syncDb } = require("./lib/function.js");
const { Main, app } = require("./index.js");
const conn = require("./config/config.json");
const port =  process.env.PORT || 3000

async function startWeb() {
	log("starting server...");
	await log("Starting Database...");
	await syncDb();
	setTimeout(() => {
		app.listen(port, (req, res) => {
			log(`server running in PORT: ${port}✓`);
		});
		Main();
	}, 1000);
}
startWeb();

module.exports = { startWeb };
