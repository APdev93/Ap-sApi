const { syncDb, resetUserApi, resetStats, log } = require("./lib/function.js");
const { Main, app } = require("./index.js");
const conn = require("./config/config.json");
const port = process.env.PORT || 3000;

async function startWeb() {
	log("Memulai server...");
	await syncDb();
	await resetStats();
	await resetUserApi();
	setTimeout(() => {
		app.listen(port, (req, res) => {
			log(`server running in PORT: ${port}✓`);
		});
		Main();
	}, 2000);
	setInterval(resetUserApi, 24 * 60 * 60 * 1000);
}
startWeb();

module.exports = { startWeb };
