const blogURL = document.querySelector('meta[name="site_url"]')
	? document.querySelector('meta[name="site_url"]').content
	: location.origin;
const position = ["top", "right", "bottom", "left"];

/**
 * @description Replace broken image with encoded image in first para
 * @param {Element} firstPara
 * @returns {Element} firstPara
 */
function brokenImage(firstPara) {
	const brokenImage = firstPara?.querySelectorAll("img");
	if (brokenImage) {
		for (let i = 0; i < brokenImage.length; i++) {
			const encodedImage = brokenImage[i];
			encodedImage.src = decodeURI(decodeURI(encodedImage.src));
			//replace broken image with encoded image in first para
			encodedImage.src = encodedImage.src.replace(location.origin, blogURL);
		}
	}
	return firstPara;
}

/**
 * Strip text of first para of unwanted characters
 * @param {Element} firstPara
 * @returns {Element} firstPara
 */
function cleanText(firstPara) {
	firstPara.innerText = firstPara.innerText
		.replaceAll("↩", "")
		.replaceAll("¶", "");
	return firstPara;
}

function calculateHeight(firstPara) {
	const paragraph = firstPara
		? firstPara.innerText
			? firstPara.innerText
			: firstPara
		: "";
	const height = Math.floor(paragraph.split(" ").length / 100);
	if (height < 2) {
		return `auto`;
	} else if (height >= 5) {
		return `20rem`;
	}
	return `${height}rem`;
}

try {
	const links = Array.from(
		document.querySelectorAll(
			`.md-content a[href^="${blogURL}"], a.footnote-ref, a[href^="./"]`,
		),
	).filter(
		(link) =>
			!link.classList.contains("link_citation") &&
			!link.classList.contains("post-link"),
	);

	tippy(links, {
		content: "",
		allowHTML: true,
		animation: "scale-subtle",
		theme: "translucent",
		followCursor: true,
		arrow: false,
		touch: "hold",
		inlinePositioning: true,
		placement: position[Math.floor(Math.random() * position.length - 1)],
		onShow(instance) {
			fetch(instance.reference.href)
				.then((response) => response.text())
				.then((html) => {
					const parser = new DOMParser();
					return parser.parseFromString(html, "text/html");
				})
				.then((doc) => {
					//create section for each content after header
					const headers = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
					headers.forEach(function (header) {
						const headerName =
							header.id ||
							header.innerText
								.split("\n")[0]
								.toLowerCase()
								.replaceAll(" ", "-");
						if (headerName.length > 0) {
							const div = doc.createElement("div");
							div.classList.add(headerName);
							let nextElement = header.nextElementSibling;
							while (
								nextElement &&
								!nextElement.matches("h1, h2, h3, h4, h5, h6")
							) {
								div.appendChild(nextElement);
								nextElement = nextElement.nextElementSibling;
							}
							header.parentNode.insertBefore(div, header.nextSibling);
						}
					});
					return doc;
				})
				//inject head into doc
				.then((doc) => {
					if (
						location.href.replace(location.hash, "") === instance.reference.href
					) {
						instance.hide();
						instance.destroy();
						return;
					}
					let firstPara = doc.querySelector("article");
					const firstHeader = doc.querySelector("h1");
					if (firstHeader && firstHeader.innerText === "Index") {
						const realFileName = decodeURI(
							doc.querySelector('link[rel="canonical"]').href,
						)
							.split("/")
							.filter((e) => e)
							.pop();
						firstHeader.innerText = realFileName;
					}
					//broken link in first para
					firstPara = brokenImage(firstPara);
					const element1 = document.querySelector(`[id^="tippy"]`);
					if (element1) {
						element1.classList.add("tippy");
					}
					const partOfText = instance.reference.href.replace(/.*#/, "#");
					let toDisplay = firstPara;
					let displayType;
					if (partOfText.startsWith("#")) {
						firstPara = doc.querySelector(
							`[id="${partOfText.replace("#", "")}"]`,
						);
						if (firstPara && firstPara.tagName === "LI") {
							// Extract inner HTML of the <li>
							toDisplay = document.createElement("div");
							toDisplay.innerHTML = firstPara.innerHTML
								.trim()
								.replaceAll("↩", "")
								.replaceAll("¶", "");
						} else if (firstPara && firstPara.tagName.includes("H")) {
							const articleDOM = document.createElement("article");
							articleDOM.classList.add("md-content__inner", "md-typeset");
							const section = doc.querySelector(
								`div.${partOfText.replace("#", "")}`,
							);
							if (section) {
								articleDOM.appendChild(section);
							}
							toDisplay = articleDOM;
							firstPara = toDisplay;
						} else if (
							firstPara &&
							firstPara.innerText.replace(partOfText).length === 0
						) {
							firstPara = doc.querySelector("div.citation");
							toDisplay = firstPara;
						} else if (firstPara) {
							const nestedContent = firstPara.querySelector("ul, ol, p");
							if (nestedContent) {
								toDisplay = nestedContent;
							} else {
								toDisplay = cleanText(firstPara);
							}
						}
						instance.popper.style.height = "auto";
					} else {
						instance.popper.style.height = calculateHeight(firstPara);
					}

					instance.popper.placement =
						position[Math.floor(Math.random() * position.length)];
					if (firstPara && firstPara.innerText.length > 0) {
						if (!displayType) {
							instance.setContent(() => {
								const container = document.createElement("div");
								container.innerHTML = toDisplay ? toDisplay.outerHTML : "";
								return container;
							});
							instance.popper.style.height = calculateHeight(toDisplay);
						}
					} else {
						firstPara = doc.querySelector("article");
						instance.reference.href.replace(/.*#/, "#");
						instance.popper.style.height = calculateHeight(firstPara);
					}
				})
				.catch((error) => {
					console.log(error);
					instance.hide();
					instance.destroy();
				});
		},
	});
} catch {
	console.log("tippy error, ignore it");
}
