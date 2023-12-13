const axios = require("axios");
const cheerio = require("cheerio");
const userAgent = require("fake-useragent");

async function instagram(url) {
	try {
		const { data } = await axios.post(
			"https://fastdl.app/c/",
			{
				url: url,
				lang_code: "en",
				token: "",
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
					"User-Agent": userAgent(),
				},
			},
		);
		const parts = data.split('href="').slice(1);
		let video = parts.map(part => part.split('"')[0].replace(/amp;/g, ""));
		const res = {
			video: video,
		};
		return res;
	} catch (e) {
		return 404;
	}
}

async function tiktok(url) {
	try {
		const { data } = await axios.post(
			"https://lovetik.com/api/ajax/search",
			{
				query: url,
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				},
			},
		);
		const result = {
			author: data.author,
			author_name: data.author_name,
			caption: data.desc,
			image: data.cover,
			video: data.links.filter(i => i.s === "NO watermark")[0].a,
			audio: data.links.filter(i => i.t.includes("MP3"))[0].a,
		};
		return result;
	} catch (e) {
		return 404;
	}
}

async function mediafire(url) {
	const res = await axios.get(url);
	const $ = cheerio.load(res.data);
	const hasil = [];
	const link = $("a#downloadButton").attr("href");
	const size = $("a#downloadButton")
		.text()
		.replace("Download", "")
		.replace("(", "")
		.replace(")", "")
		.replace("\n", "")
		.replace("\n", "")
		.replace("                         ", "");
	const seplit = link.split("/");
	const nama = seplit[5];
	let mime = nama.split(".");
	mime = mime[1];
	hasil.push({ nama, mime, size, link });
	return hasil;
}

async function ytb(url) {
	try {
		const json = {
			link: url,
			from: "ytbsaver",
		};

		const { data } = await axios.post(
			"https://api.ytbvideoly.com/api/thirdvideo/parse",
			json,
			{
				headers: {
					"Content-type": "application/x-www-form-urlencoded",
				},
			},
		);

		let result = data.data;
		let res = {
			title: result.title,
			size: result.formats[0].size,
			thumbnail: result.thumbnail,
			video: result.formats[0].url,
			audio: result.audios.m4a[0].url,
		};
		return res;
	} catch (e) {
		return { response: e };
	}
}



module.exports = {
	tiktok,
	mediafire,
	instagram,
	ytb,
};
