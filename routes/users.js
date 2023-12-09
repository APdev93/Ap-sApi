const root = process.cwd();

const express = require("express");
const session = require("express-session");
const router = express.Router();

const fs = require("fs");
const { makeUsers, login, syncDb, sleep } = require(`${root}/lib/function.js`);

const config = require(`${root}/config/config.json`);
const rootPath = { root: __dirname };

router.use(
	session({
		secret: "sessionkey",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 30 * 24 * 60 * 60 * 1000, // atur masa aktif cookies selama 1 bulan
		},
	}),
);

const userDb = `${root}/database/user.json`;

if (!fs.existsSync(userDb)) {
	fs.writeFileSync(userDb, "{}", "utf-8");
}

function isAuth(req, res, next) {
	if (req.session && req.session.user) {
		return next();
	}
	res.redirect("/masuk");
}

router.post("/regist", (req, res, next) => {
	if (req) {
		makeUsers(req, res);
		syncDb();
		setTimeout(function () {
			res.redirect("/masuk");
		}, 2000);
	}
});

router.post("/login", async (req, res, next) => {
	const { number } = req.body;
	if (number) {
		let Found = await login(req, res);
		if (Found) {
			const userData = JSON.parse(fs.readFileSync(userDb, "utf-8"));
			// Mencari pengguna berdasarkan nomor telepon
			const user = userData[number];
			req.session.usrnumber = number;
			req.session.user = user;
			console.log(user);
			console.log(`=> ${number} Logged in`);
			setTimeout(function () {
				res.redirect("/dashboard");
			}, 2000);
		} else {
			res.status(404).json({ msg: false });
			console.log(`=> Login failed for ${number}`);
		}
	}
});

router.get("/dash", isAuth, (req, res, next) => {
	let usr = req.session.user;
	let number = req.session.usrnumber;
	const data = {
		number: number,
		user: usr.fullname,
		key: usr.api.key,
		limit: usr.api.limit,
		usage: usr.api.usage,
	};
	res.json(data);
});

router.get("/logout", (req, res, next) => {
	req.session.destroy();
	setTimeout(function () {
		res.redirect("/masuk");
	}, 2000);
});

router.post("/change-pw", (req, res, next) => {});

module.exports = router;
