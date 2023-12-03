const root = process.cwd();
/* Untuk module ada di bawah ini */
const express = require("express");
const fs = require("fs/promises");
/* import module dari src/ */
const { tiktok, mediafire, instagram, ytb } = require(
	`${root}/lib/src/downloader.js`,
);
const { pinterest, wallpaper } = require(`${root}/lib/src/search.js`);
const { getData } = require(`${root}/lib/function.js`);
const config = require(`${root}/config/config.json`);
const router = express.Router();
const msg = config.msg;

const checkKey = async (req, res, next) => {
	const apiKey = req.query.apikey;

	try {
		const data = await fs.readFile(`${root}/database/user.json`);
		const users = JSON.parse(data);
		const user = Object.values(users).find(u => u.api.key === apiKey);
		if (!user) {
			return res.status(401).json({ error: "Invalid API key" });
		}
		// Mengecek batas penggunaan
		if (user.api.limit <= 0) {
			return res.status(429).json({ error: "API key usage limit exceeded" });
		}
		// Mengurangi batas penggunaan
		user.api.limit--;
		user.api.usage++;
		// Menyimpan perubahan ke dalam file
		await fs.writeFile(`${root}/database/user.json`, JSON.stringify(users));
		// API key valid, lanjutkan ke endpoint berikutnya
		next();
	} catch (error) {
		console.error("Error reading or writing JSON file:", error);
		res.status(500).json(msg.srvErr);
	}
};

/*router*/

// DOWNLOADER
router.get("/downloader/tt", checkKey, async (req, res, next) => {
	let url = req.query.url;
	if (url) {
		try {
			let result = await tiktok(url);
			getData(req, res, result);
		} catch (e) {
			res.json(msg.srvErr);
		}
	} else {
		res.status(404).json(msg.needUrl);
	}
});

router.get("/downloader/ig", checkKey, async (req, res, next) => {
	let url = req.query.url;
	if (url) {
		try {
			let result = await instagram(url);
			getData(req, res, result);
		} catch (e) {
			res.json(msg.srvErr);
		}
	} else {
		res.status(404).json(msg.needUrl);
	}
});

router.get("/downloader/yt", checkKey, async (req, res, next) => {
	let url = req.query.url;
	if (url) {
		try {
			let result = await ytb(url);
			getData(req, res, result);
		} catch (e) {
			res.json(msg.srvErr);
		}
	} else {
		res.status(404).json(msg.needUrl);
	}
});

router.get("/downloader/mediafire", checkKey, async (req, res, next) => {
	let url = req.query.url;
	if (url) {
		try {
			let result = await mediafire(url);
			getData(req, res, result);
		} catch (e) {
			res.json(msg.srvErr);
		}
	} else {
		res.status(404).json(msg.needUrl);
	}
});

// searching img

router.get("/img/pin", checkKey, async (req, res, next) => {
	let q = req.query.q;
	if (q) {
		try {
			let result = await pinterest(q);
			getData(req, res, result);
		} catch (e) {
			res.json(msg.srvErr);
		}
	} else {
		res.status(404).json(msg.needUrl);
	}
});

router.get("/img/wallpaper", checkKey, async (req, res, next) => {
	let q = req.query.q;
	if (q) {
		try {
			let result = await wallpaper(q);
			getData(req, res, result);
		} catch (e) {
			res.json(msg.srvErr);
		}
	} else {
		res.status(404).json(msg.needUrl);
	}
});





module.exports = router;
