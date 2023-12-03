const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

/* Server */
const { syncDb, makeOtp } = require("./lib/function.js");
const { sendOtp } = require("./main.js");
const conn = require("./config/config.json");
const api = require("./routes/api.js");
const admin = require("./routes/admin.js");
const users = require("./routes/users.js");
// config
const port = conn.srv.port;
const rootPath = { root: __dirname };

async function Main() {
	app.use(express.static("public"));
	app.use(bodyParser.urlencoded({ extended: true }));
	/* Agar api bisa di akses dari luar*/
	app.use(cors({ origin: conn.srv.root }));

	app.use(
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
		if (req.session && req.session.user) {
			return next();
		}
		res.redirect("/masuk");
	}

	//main route
	app.get("/dashboard", isAuth, (req, res) => {
		res.sendFile("./public/pages/dashboard.html", rootPath);
	});
	app.get("/", (req, res) => {
		res.sendFile("./public/index.html", rootPath);
	});
	app.get("/masuk", (req, res) => {
		res.sendFile("./public/login.html", rootPath);
	});
	app.get("/daftar", (req, res) => {
		res.sendFile("./public/regist.html", rootPath);
	});

	app.get("/sandi_baru", (req, res) => {
		res.sendFile("./public/reqnum.html", rootPath);
	});
	app.get("/confirmotp", (req, res) => {
		res.sendFile("./public/confirmotp.html", rootPath);
	});
	app.post("/reqotp", async (req, res) => {
		let usrNum = req.body.number;
		let newotp = makeOtp();
		req.session.dataOtp = newotp;
		let otp = sendOtp(usrNum, newotp);
		if (otp) {
			res.redirect("/confirmotp");
		} else {
			res.send("masukan nomer");
		}
	});
	app.post("/cekotp", (req, res) => {
		let inputOtp = req.body.otp;
		let avaibleOtp = req.session.dataOtp;
		if (inputOtp === avaibleOtp) {
			res.send("otp benar");
			setTimeout(function () {
				delete req.session.dataOtp;
			}, 100);
		} else {
			res.send("otp salah");
		}
	});

	//other route
	app.use("/admin", admin);
	app.use("/auth", users);
	app.use("/api", api);

	/*Pengalihan jika route url tidak ada, tidak boleh di pindah ke atas*/
	app.use("/", (req, res) => {
		res.status(404).json({ msg: conn.msg.notfound });
	});
}

module.exports = { app, Main };
