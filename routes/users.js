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

function isAuth(req, res, next) {
	if (req.session.email) {
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
	const { email } = req.body;
	if (email) {
		let Found = await login(req, res);
		if (Found) {
			console.log(`=> ${email} Logged in`);
			req.session.email = email;
			setTimeout(function () {
				res.redirect("/auth/dash");
			}, 2000);
		} else {
			res.status(404).json({ msg: false });
			console.log(`=> Login failed for ${email}`);
		}
	}
});

router.get("/dash", isAuth, (req, res, next) => {
	res.send("dashboard");
});

router.get("/logout", (req, res, next) => {
	req.session.destroy();
	setTimeout(function () {
		res.redirect("/masuk");
	}, 2000);
});

router.post("/change-pw", (req, res, next) => {});

module.exports = router;
