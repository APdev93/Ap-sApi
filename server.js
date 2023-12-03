const log = console.log;

const { syncDb } = require("./lib/function.js");
const { color } = require("./lib/color.js");
const { Main, app } = require("./index.js");
const conn = require("./config/config.json");
const port =  process.env.PORT || 3000

async function startWeb() {
	log(color("starting server...", "red"));
	await log(color("Starting Database...", "yellow"));
	await syncDb();
	setTimeout(() => {
		app.listen(port, (req, res) => {
			log(color(`server running in PORT: ${port}✓`, "green"));
		});
		Main();
	}, 1000);
}
startWeb();

module.exports = { startWeb };
