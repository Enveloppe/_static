window.onload = function () {
	const frameElement = document.querySelector("iframe");
	if (!frameElement) {
		return;
	}
	/** get all file in assets/stylesheets */
	const fileInStylesheets = [];
	const files = document.querySelectorAll("link");
	files.forEach((file) => {
		if (file.href.endsWith(".css")) {
			fileInStylesheets.push(file.href);
		}
	});
	const doc = frameElement.contentDocument || frameElement.contentWindow.document;
	fileInStylesheets.forEach((file) => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = file;
		link.type = "text/css";
		doc.head.appendChild(link);
	});
	const theme = document.querySelector("[data-md-color-scheme]");
	/** get slate bg */

	if (theme.getAttribute("data-md-color-scheme") === "default") {
		doc.body.setAttribute("class", "light");
	} else {
		doc.body.setAttribute("class", "dark");
		const bgColor = getComputedStyle(theme).getPropertyValue("--md-default-bg-color");
		doc.body.style.setProperty("--md-default-bg-color", bgColor);
	}
	doc.body.classList.add("graph-view");
};
