const d = document;

const navToggle = d.getElementById("toggle");
const navList = d.getElementById("nav-list");
const nav = d.getElementById("nav");

navToggle.addEventListener("click", () => {
	if (navToggle.checked) {
		navList.classList = "nav-list-1";
		navList.classList.add("nav-visible");
		nav.classList.add("nav-border-rad");
	} else {
		navList.classList = "nav-list-1";
		navList.classList.add("nav-hidden");
		nav.classList.remove("nav-border-rad");
		setTimeout(() => {
			navList.classList = "hide";
		}, 500);
	}
});

let typingEffect = new Typed(".typedText", {
	strings: [
		"Selamat datang!",
		"Ada yang bisa dibantu?",
		"Ada pertanyaan?",
		"Kami di sini.",
		"Semoga menyenangkan!",
		"Antarmuka Ap's API:",
		"Berbasis GET",
		"Menyediakan akses data.",
		"Berkomunikasi melalui HTTP.",
		"Menggunakan metode HTTP.",
		"Terimakasih Telah Menggunakan Layanan Ini",
	],
	loop: true,
	typeSpeed: 50,
	backSpeed: 50,
	backDelay: 500,
});
