const root = process.cwd();

const fs = require("fs");

const userDb = `${root}/database/user.json`;

function readUserData() {
	try {
		return JSON.parse(fs.readFileSync(userDb, "utf8"));
	} catch (error) {
		console.error("Error reading user data:", error.message);
		return null;
	}
}

function writeUserData(userData) {
	try {
		fs.writeFileSync(userDb, JSON.stringify(userData, null, 3), "utf8");
	} catch (error) {
		console.error("Error writing user data:", error.message);
	}
}

function resetUserApi() {
	const currentTime = Date.now();
	const userData = readUserData();

	if (userData) {
		for (const userId in userData) {
			if (
				userData.hasOwnProperty(userId) &&
				currentTime - userData[userId].api.lastReset >= 24 * 60 * 60 * 1000
			) {
				userData[userId].api.limit = 15;
				userData[userId].api.usage = 0;
				userData[userId].api.lastReset = currentTime;
			}
		}

		writeUserData(userData);
		console.log("Reset api user berhasil dilakukan.");
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
			},
		};
		data[number] = newUsers;
		fs.writeFileSync(dataPath, formatJSON(data));
		console.log(`register user ${number} berhasil`);
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
				console.log(number + "login");
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
	makeOtp,
	resetUserApi
};
