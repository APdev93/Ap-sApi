const root = process.cwd();

const fs = require("fs");

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
	console.log(
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
	const { fullname, email, password } = req.body;
	if (fullname && email && password) {
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
			},
		};
		data[email] = newUsers;
		fs.writeFileSync(dataPath, formatJSON(data));
		console.log(`register user ${email} berhasil`);
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
	const { email, password } = req.body;
	for (let userEmail in dbUser) {
		if (dbUser.hasOwnProperty(userEmail)) {
			let user = dbUser[userEmail];
			if (userEmail === email && user.password === password) {
				return user;
				console.log(email + "login");
			}
		}
	}
	return null;
}

function syncDb() {
	const dbPath = `${root}/database/user.json`;
	fs.watchFile(dbPath, (curr, prev) => {
		console.log(`Sinkronkan database berhasil`);
	});
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
	makeOtp
};
