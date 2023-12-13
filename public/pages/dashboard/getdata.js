function getUserData() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/auth/dash");
	xhr.responseType = "json";

	xhr.onload = () => {
		const data = xhr.response;
		let user = document.getElementById("username");
		let numb = document.getElementById("number");
		user.innerHTML = data.user;
		numb.innerHTML = data.number;
	};
	xhr.send();
}

function getDashData() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "/auth/stats");
	xhr.responseType = "json";

	xhr.onload = () => {
		const data = xhr.response;
		let tUsr = document.getElementById("t-usr");
		let tLog = document.getElementById("t-log");
		let treg = document.getElementById("t-req");
		tUsr.innerHTML = data.total;
		tLog.innerHTML = data.online;
	};
	xhr.send();
}

document.addEventListener("DOMContentLoaded", async () => {
	await getUserData();
	await setTimeout(function () {
		getDashData();
	}, 3000);
});
