const {
	default: makeWaconnet,
	useMultiFileAuthState,
	fetchLatestBaileysVersion,
	DisconnectReason,
	makeCacheableSignalKeyStore,
	makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const readline = require("readline");

const msgRetryCounterCache = new NodeCache();

const usePairingCode = true;
const useMobile = false;
const useStore = false;

const MAIN_LOGGER = pino({
	timestamp: () => `,"time":"${new Date().toJSON()}"`,
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const store = useStore ? makeInMemoryStore({ logger }) : undefined;
store?.readFromFile("./session.json");

setInterval(() => {
	store?.writeToFile("./session.json");
}, 10000 * 6);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const question = text => new Promise(resolve => rl.question(text, resolve));

const P = require("pino")({
	level: "silent",
});
async function sendOtp(nomerUser, OTP) {
	console.log("starting bot server...");
	const startBot = async () => {
		let { state, saveCreds } = await useMultiFileAuthState("session");
		let { version } = await fetchLatestBaileysVersion();
		const conn = makeWaconnet({
			version,
			logger: P,
			printQRInTerminal: !usePairingCode,
			mobile: useMobile,
			browser: ["chrome (linux)", "", ""],
			auth: {
				creds: state.creds,
				keys: makeCacheableSignalKeyStore(state.keys, P),
			},
			msgRetryCounterCache,
		});
		store?.bind(conn.ev);
		conn.ev.on("creds.update", saveCreds);

		if (usePairingCode && !conn.authState.creds.registered) {
			if (useMobile) {
				throw new Error("Tidak bisa menggunakan mobile auth");
			}
			try {
				const phoneNum = await question(
					"Silahkan masukan nomer whatsapp yang aktif: ",
				);
				const code = await conn.requestPairingCode(phoneNum);
				await console.log(
					"Silahkan Gunakan Kode Ini Untuk Menghubungkan Ke sockets",
				);
				await console.log(`CODE : ${code}`);
			} catch (err) {
				console.log(`Maaf. Ada kesalahan teknis: ${err}`);
			}
		}

		conn.ev.on("connection.update", async update => {
			const { connection, lastDisconnect } = update;

			if (lastDisconnect == "undefined") {
				console.log("tidak bisa terkoneksi, silahkan koneksikan ulang!");
			}
			if (connection === "connecting") {
				console.log("Menghubungkan ke sockets");
			} else if (connection === "open") {
				console.log("Terhubung ke sockets");
				let textNewOtp = `Silahkan Gunakan Kode OTP Ini untuk mereset password ${OTP}`;
				let userNum = nomerUser + "@s.whatsapp.net";
				conn.sendMessage(userNum, {
					text: textNewOtp,
				});
				setTimeout(function () {
					conn.end();
					console.log("connection close");
				}, 10000);
			} else if (connection === "close") {
				console.log("bot closes");
				conn.end();
			}
		});
	};
	startBot();
}

module.exports = { sendOtp };
