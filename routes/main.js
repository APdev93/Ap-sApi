const root = process.cwd();

const express = require("express");
const router = express.Router();


router.use("/info", async (req, res, next) => {
	let tanggalWaktu = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Makassar",
	});
	let date = new Date(tanggalWaktu);
	let jam = date.getHours();
	let menit = date.getMinutes();
	let detik = date.getSeconds();
	let old = performance.now();
	let neww = performance.now();
	let mili = old / neww;
	let milsec = mili.toFixed(3);
	let port = process.env.PORT;

	let dd = date.getDate();
	let yy = date.getFullYear();
	let mm = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(date);

	let status = {
		status: "online",
		port: port,
		time: `${jam}:${menit}:${detik} WIB`,
		date: `${dd}/${mm}/${yy}`,
		speed: `${milsec}ms`,
	};
	res.json(status);
});



module.exports = router;
