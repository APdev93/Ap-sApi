const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

const ipfilter = require("express-ipfilter").IpFilter;

const app = express();

/* Server */
const { syncDb, makeOtp, log } = require("./lib/function.js");
const { sendOtp } = require("./main.js");
const conn = require("./config/config.json");
const api = require("./routes/api.js");
const admin = require("./routes/admin.js");
const users = require("./routes/users.js");
const main = require("./routes/main.js");
// config
const port = conn.srv.port;
const rootPath = { root: __dirname };

async function Main() {
	log("server running");
	app.use(express.static("public"));
	app.use(express.static("public/pages/dashboard"));
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

	// anti ddos

	const blockedIPs = [];
	const requestTracker = {};

	const DDoS_THRESHOLD = conn.srv.req_limit;
	const DETECTION_WINDOW = conn.srv.detect_window;

	// Middleware untuk melacak dan memblokir IP
	const ipFilter = ipfilter({
		detectIp: req => req.ip,
		forbiddenResponse: "IP Anda diblokir karena aktivitas yang mencurigakan.",
		log: true,
	});

	app.use(ipFilter);

	app.use((req, res, next) => {
		const clientIP = req.ip;
		requestTracker[clientIP] = (requestTracker[clientIP] || 0) + 1;
		setTimeout(() => {
			requestTracker[clientIP] = 0;
		}, DETECTION_WINDOW);
		if (
			requestTracker[clientIP] > DDoS_THRESHOLD &&
			!blockedIPs.includes(clientIP)
		) {
			log(`Deteksi DDoS dari IP: ${clientIP}, blokir IP.`);
			blockedIPs.push(clientIP);
		}
		next();
	});

	//main route
	app.get("/dashboard", isAuth, (req, res) => {
		res.sendFile("./public/pages/dashboard/index.html", rootPath);
	});
	app.get("/", (req, res) => {
		let ip = req.ip;
		console.log(`request from: ${ip}`);
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
	app.use("/main", main);

	/*Pengalihan jika route url tidak ada, tidak boleh di pindah ke atas*/
	app.use("/", (req, res) => {
		res.status(404);
		res.sendFile("./public/404.html", rootPath)
	});
}

module.exports = { app, Main };
