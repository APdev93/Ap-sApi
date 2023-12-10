const root = process.cwd();

const tanggalWaktu = new Date().toLocaleString("en-US", {
	timeZone: "Asia/Makassar",
});
const Dates = new Date(tanggalWaktu);
const jam = Dates.getHours();
const menit = Dates.getMinutes();
const detik = Dates.getSeconds();

const dd = Dates.getDate();
const yy = Dates.getFullYear();
const mm = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(Dates);

const warna = {
	merah: "\x1b[31m",
	hijau: "\x1b[32m",
	biru: "\x1b[34m",
	reset: "\x1b[0m",
};

const fs = require("fs");
const conn = fs.readFileSync(`${root}/config/config.json`);

const userDb = `${root}/database/user.json`;
const dbPath = [`${root}/database/user.json`, `${root}/database/stats.json`];

function getInfo() {
	let waktu = `${jam} : ${menit} : ${detik} WIB`;
	let tanggal = `${dd}/${mm}/${yy}`;
	let data = {
		owner: "@Ardian93",
		time: waktu,
		date: tanggal,
	};
	return data;
}

function log(input) {
	let times = `${warna.biru}[${warna.reset}${warna.hijau}${jam}${warna.reset}${warna.merah}:${warna.reset}${warna.hijau}${menit}${warna.reset}${warna.biru}]${warna.reset}${warna.merah}:${warna.reset} `;
	return console.log(times + input);
}

function readUserData() {
	try {
		return JSON.parse(fs.readFileSync(userDb, "utf8"));
	} catch (error) {
		log("Error reading user data:", error.message);
		return null;
	}
}

function writeUserData(userData) {
	try {
		fs.writeFileSync(userDb, JSON.stringify(userData, null, 3), "utf8");
	} catch (error) {
		log("Error writing user data:", error.message);
	}
}

function resetUserApi() {
	let time = `${jam}:${menit}:${detik}`;

	const userData = readUserData();
	log("Mereset api pengguna...");

	if (userData) {
		for (const userId in userData) {
			if (userData.hasOwnProperty(userId)) {
				userData[userId].api.limit = 15;
				userData[userId].api.usage = 0;
				userData[userId].api.last_reset = time;
			}
			writeUserData(userData);
		}

		log("Reset api pengguna berhasil dilakukan.");
	}
}

/**
 * Json Formater
 * @param {object} object
 * @returns {string}
 */
function formatJSON(object) {
	return JSON.stringify(object, null, 3);
}

function makeOtp() {
	let otp = "";
	const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const charsLength = chars.length;
	for (let i = 0; i < 6; i++) {
		otp += chars.charAt(Math.floor(Math.random() * charsLength));
	}
	return otp;
}

/**
 * getting Data
 * @param {string} req
 * @param {string} res
 * @param {object} data
 * @returns {string}
 */
function getData(req, res, data) {
	log(
		"New Request" +
			"\n" +
			formatJSON({
				from: req.ip,
			}),
	);
	return res.status(200).json({
		status: 200,
		response: "OK!",
		message: "Berhasil mengambil data",
		data: data,
	});
}

function makeKey() {
	let key = "";
	const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const charsLength = chars.length;
	for (let i = 0; i < 25; i++) {
		key += chars.charAt(Math.floor(Math.random() * charsLength));
	}
	return key;
}

/**
 * Create Users
 * @param {string} req
 * @param {string} res
 */
function makeUsers(req, res) {
	const { fullname, number, password } = req.body;
	if (fullname && number && password) {
		res.status(200);
		const dataPath = `${root}/database/user.json`;
		const jsonData = fs.readFileSync(dataPath, "utf8");
		const data = JSON.parse(jsonData);
		const newUsers = {
			fullname: fullname,
			password: password,
			isAdmin: false,
			api: {
				key: makeKey(),
				limit: 15,
				usage: 0,
				last_reset: "",
			},
		};
		data[number] = newUsers;
		fs.writeFileSync(dataPath, formatJSON(data));
		log(`register user ${number} berhasil`);
	} else {
		res.json({ msg: "silahkan masukan data anda" });
	}
}

/**
 * Users Login
 * @param {string} req
 * @param {string} res
 * @returns {null}
 */
function login(req, res) {
	const dbUser = JSON.parse(fs.readFileSync(`${root}/database/user.json`));
	const { number, password } = req.body;
	for (let userNumber in dbUser) {
		if (dbUser.hasOwnProperty(userNumber)) {
			let user = dbUser[userNumber];
			if (userNumber === number && user.password === password) {
				return user;
				log(number + "login");
			}
		}
	}
	return null;
}

function syncDb() {
	log("Mensinkronkan Database...");
	dbPath.forEach(path => {
		fs.watchFile(path, (curr, prev) => {
			log("sync database berhasil");
		});
	});
}

function resetStats() {
	log("Memulai Database...");
	let stats = {
		user: {
			total: 0,
			online: 0,
		},
	};
	fs.writeFileSync(
		`${root}/database/stats.json`,
		JSON.stringify(stats, null, 3),
	);
}

/**
 * SleepTime
 * @param {Number} timer
 * @returns {Number}
 */
function sleep(timer) {
	return setTimeout(() => {}, timer);
}

module.exports = {
	formatJSON,
	getData,
	makeKey,
	makeUsers,
	login,
	syncDb,
	sleep,
	makeOtp,
	resetUserApi,
	resetStats,
	log,
	getInfo,
};
