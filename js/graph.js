window.onload = function () {
	const frameElement = document.querySelector("iframe");
	if (!frameElement) return;
	let doc;
	try {
		const sameOrigin = frameElement.contentWindow?.location?.origin === location.origin;
		if (!sameOrigin) {
			console.warn("The iframe is not the one we want: we want the graph, that has the same origin! Ignore.");
			return;
		}

		doc = frameElement.contentDocument || frameElement.contentWindow.document;
	} catch (e) {
		console.warn("Unable to access the iframe (CORS blocked) :", e);
		return;
	}

	const fileInStylesheets = [];
	const files = document.querySelectorAll("link[href$='.css']");
	files.forEach((file) => {
		fileInStylesheets.push(file.href);
	});

	fileInStylesheets.forEach((file) => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = file;
		link.type = "text/css";
		doc.head.appendChild(link);
	});

	const theme = document.querySelector("[data-md-color-scheme]");
	if (theme?.getAttribute("data-md-color-scheme") === "default") {
		doc.body.setAttribute("class", "light");
	} else {
		doc.body.setAttribute("class", "dark");
		const bgColor = getComputedStyle(theme).getPropertyValue("--md-default-bg-color");
		if (bgColor) {
			doc.body.style.setProperty("--md-default-bg-color", bgColor);
		}
	}
	doc.body.classList.add("graph-view");
};
