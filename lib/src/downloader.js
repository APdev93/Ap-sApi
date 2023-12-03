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

function pinterest(querry) {
	return new Promise(async (resolve, reject) => {
		axios
			.get("https://id.pinterest.com/search/pins/?autologin=true&q=" + querry, {
				headers: {
					cookie:
						'_auth=1; _b="AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg="; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0',
				},
			})
			.then(({ data }) => {
				const $ = cheerio.load(data);
				const result = [];
				const hasil = [];
				$("div > a")
					.get()
					.map(b => {
						const link = $(b).find("img").attr("src");
						result.push(link);
					});
				result.forEach(v => {
					if (v == undefined) return;
					hasil.push(v.replace(/236/g, "736"));
				});
				hasil.shift();
				resolve(hasil);
			});
	});
}

module.exports = {
	tiktok,
	mediafire,
	instagram,
	ytb,
	pinterest,
};
