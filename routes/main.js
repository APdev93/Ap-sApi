const root = process.cwd();

const express = require("express");
const router = express.Router();

const { getInfo } = require(`${root}/lib/function.js`);

router.use("/info", async (req, res, next) => {
	let date = new Date();
	let jam = date.getHours();
	let menit = date.getMinutes();
	let detik = date.getSeconds();
	let old = performance.now();
	let neww = performance.now();
	let mili = old / neww;
	let milsec = mili.toFixed(3);
	let port = process.env.PORT || 8080 || 5000 || 3000;
	let status = {
		status: "online",
		port: port,
		time: `${jam} : ${menit} : ${detik} `,
		speed: `${milsec}ms`,
		info: {
			owner: "ardian",
			apikey: "",
		},
	};
	res.json(status);
});

module.exports = router;
