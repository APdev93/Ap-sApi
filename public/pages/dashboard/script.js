const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach(item => {
	const li = item.parentElement;

	item.addEventListener("click", function () {
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove("active");
		});
		li.classList.add("active");
	});
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
	sidebar.classList.toggle("hide");
});

if (window.innerWidth < 768) {
	sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
	searchButtonIcon.classList.replace("bx-x", "bx-search");
	searchForm.classList.remove("show");
}

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
	if (this.checked) {
		document.body.classList.add("dark");
	} else {
		document.body.classList.remove("dark");
	}
});

//MENU LIST
const fitur = document.getElementById("features");
const fName = document.getElementById("feature-name");
const ftop = document.getElementById("ftop");

const dash = document.getElementById("dashboard");
const downloader = document.getElementById("downloader");

dash.addEventListener("click", () => {
	fName.innerHTML = "home";
	fitur.innerHTML = "";
	ftop.innerHTML = `
	            <ul class="box-info">
							<li>
								<i class="bx bxs-user-plus"></i>
								<span class="text">
									<h3>0</h3>
									<p>Total User</p>
								</span>
							</li>
							<li>
								<i class="bx bxs-user-check"></i>
								<span class="text">
									<h3>0</h3>
									<p>User Uogin</p>
								</span>
							</li>
							<li>
								<i class="bx bxs-dollar-circle"></i>
								<span class="text">
									<h3>0</h3>
									<p>Total Request</p>
								</span>
							</li>
						</ul>`;
});

downloader.addEventListener("click", () => {
	fName.innerHTML = "downloader";
	ftop.innerHTML = "";
	fitur.innerHTML = `
						<div class="todo">
							<div class="head">
								<h3>Downloader</h3>
								<i class="bx bx-filter"></i>
							</div>
							<ul class="todo-list">
								<li class="get">
								  <a href="/api/downloader/yt?url=url&apikey=apikey">
									<p>YouTube</p>
									</a>
									<i class="bx bx-dots-vertical-rounded"></i>
								</li>
								<li class="get">
								  <a href="/api/downloader/ig?url=url&apikey=apikey">
									<p>Instagram</p>
									</a>
									<i class="bx bx-dots-vertical-rounded"></i>
								</li>
								<li class="get">
								  <a href="/api/downloader/tt?url=url&apikey=apikey">
									<p>Tiktok</p>
									</a>
									<i class="bx bx-dots-vertical-rounded"></i>
								</li>
								<li class="get">
								  <a href="/api/downloader/mf?url=url&apikey=apikey">
									<p>MediaFire</p>
									</a>
									<i class="bx bx-dots-vertical-rounded"></i>
								</li>
							</ul>
						</div>
   `;
});
