let mkDocsChirpyTranslator = { default: "light", slate: "dark" },
	mkDocs = document.querySelector("[data-md-color-scheme]"),
	chirpy = document.querySelector("[data-chirpy-theme]");
if (chirpy) {
	"default" === mkDocs.getAttribute("data-md-color-scheme") &&
		chirpy.setAttribute("data-chirpy-theme", "light");
	let e = new MutationObserver((e) => {
		e.forEach((e) => {
			"attributes" === e.type &&
				chirpy.setAttribute(
					"data-chirpy-theme",
					mkDocsChirpyTranslator[mkDocs.dataset.mdColorScheme],
				);
		});
	});
	e.observe(mkDocs, {
		attributes: !0,
		attributeFilter: ["data-md-color-scheme"],
	});
}
window.onload = function () {
	var e = document.querySelector("iframe");
	if (e) {
		let t = [];
		document.querySelectorAll("link").forEach((e) => {
			e.href.endsWith(".css") && t.push(e.href);
		});
		let r = e.contentDocument || e.contentWindow.document;
		t.forEach((e) => {
			var t = document.createElement("link");
			(t.rel = "stylesheet"),
				(t.href = e),
				(t.type = "text/css"),
				r.head.appendChild(t);
		});
		var e = document.querySelector("[data-md-color-scheme]");
		"default" === e.getAttribute("data-md-color-scheme")
			? r.body.setAttribute("class", "light")
			: (r.body.setAttribute("class", "dark"),
				(e = getComputedStyle(e).getPropertyValue("--md-default-bg-color")),
				r.body.style.setProperty("--md-default-bg-color", e)),
			r.body.classList.add("graph-view");
	}
};
let paletteSwitcher1 = document.getElementById("__palette_1"),
	paletteSwitcher2 = document.getElementById("__palette_2"),
	isMermaidPage = document.querySelector(".mermaid"),
	header_links =
		(isMermaidPage &&
			(paletteSwitcher1.addEventListener("change", () => {
				location.reload();
			}),
			paletteSwitcher2.addEventListener("change", () => {
				location.reload();
			})),
		document.querySelectorAll('a[href*="#"]'));
if (header_links)
	for (var i = 0; i < header_links.length; i++) {
		let e = header_links[i].getAttribute("href").replace("^.*#", ""),
			t = e.replace(/\s/g, "-");
		(t = e.normalize("NFD").replace(/[\u0300-\u036f]/g, "")),
			header_links[i].setAttribute(
				"href",
				header_links[i].getAttribute("href").replace(e, t),
			);
	}
for (let r of document.querySelectorAll("img")) {
	let t =
		/^(?<alt>(?!^\d*x?\d*$).*?)?(\|?\s*?(?<width>\d+)(x(?<height>\d+))?)?$/gi;
	if (r.alt.match(t)) {
		let e = t.exec(r.alt ?? "");
		(r.width = e.groups.width ?? r.width),
			(r.height = e.groups.height ?? r.height),
			(r.alt = e.groups.alt ?? r.alt);
	}
}
let article = document.querySelectorAll(
		"article.md-content__inner.md-typeset > *:not(.highlight)",
	),
	embed_id_regex = /\^\w+\s*$/gi;
for (let t of article) {
	let e = t.innerText.match(embed_id_regex);
	e && (t.innerHTML = t.innerText.replace(e, ""));
}
document.innerText = article;
let cite = document.querySelectorAll(".citation");
if (cite)
	for (let r of cite) {
		let t = r.innerHTML.match(/!?(\[{2}|\[).*(\]{2}|\))/gi);
		if (t) {
			for (let e of t) r.innerHTML = r.innerHTML.replace(e, "");
			r.innerText.trim().length < 2 && (r.style.display = "none");
		}
	}
let blogURL = document.querySelector('meta[name="site_url"]')
		? document.querySelector('meta[name="site_url"]').content
		: location.origin,
	position = ["top", "right", "bottom", "left"];

function brokenImage(e) {
	var t = e?.querySelectorAll("img");
	if (t)
		for (let e = 0; e < t.length; e++) {
			var r = t[e];
			(r.src = decodeURI(decodeURI(r.src))),
				(r.src = r.src.replace(location.origin, blogURL));
		}
	return e;
}

function cleanText(e) {
	return (e.innerText = e.innerText.replaceAll("↩", "").replaceAll("¶", "")), e;
}

function calculateHeight(e) {
	(e = e ? e.innerText || e : ""), (e = Math.floor(e.split(" ").length / 100));
	return e < 2 ? "auto" : 5 <= e ? "20rem" : e + "rem";
}

try {
	let e = Array.from(
		document.querySelectorAll(
			`.md-content a[href^="${blogURL}"], a.footnote-ref, a[href^="./"]`,
		),
	).filter((e) => !e.classList.contains("link_citation"));
	tippy(e, {
		content: "",
		allowHTML: !0,
		animation: "scale-subtle",
		theme: "translucent",
		followCursor: !0,
		arrow: !1,
		touch: "hold",
		inlinePositioning: !0,
		placement: position[Math.floor(Math.random() * position.length - 1)],
		onShow(n) {
			fetch(n.reference.href)
				.then((e) => e.text())
				.then((e) => new DOMParser().parseFromString(e, "text/html"))
				.then(
					(i) => (
						i.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(function (t) {
							var r =
								t.id ||
								t.innerText.split("\n")[0].toLowerCase().replaceAll(" ", "-");
							if (0 < r.length) {
								var l = i.createElement("div");
								l.classList.add(r);
								let e = t.nextElementSibling;
								for (; e && !e.matches("h1, h2, h3, h4, h5, h6"); )
									l.appendChild(e), (e = e.nextElementSibling);
								t.parentNode.insertBefore(l, t.nextSibling);
							}
						}),
						i
					),
				)
				.then((r) => {
					if (location.href.replace(location.hash, "") === n.reference.href)
						n.hide(), n.destroy();
					else {
						let e = r.querySelector("article");
						var l,
							i = r.querySelector("h1"),
							i =
								(i &&
									"Index" === i.innerText &&
									((o = decodeURI(r.querySelector('link[rel="canonical"]').href)
										.split("/")
										.filter((e) => e)
										.pop()),
									(i.innerText = o)),
								(e = brokenImage(e)),
								document.querySelector('[id^="tippy"]')),
							o =
								(i && i.classList.add("tippy"),
								n.reference.href.replace(/.*#/, "#"));
						let t = e;
						o.startsWith("#")
							? ((e = r.querySelector(`[id="${o.replace("#", "")}"]`)) &&
								"LI" === e.tagName
									? ((t = document.createElement("div")).innerHTML = e.innerHTML
											.trim()
											.replaceAll("↩", "")
											.replaceAll("¶", ""))
									: e && e.tagName.includes("H")
										? ((i = document.createElement("article")).classList.add(
												"md-content__inner",
												"md-typeset",
											),
											(l = r.querySelector("div." + o.replace("#", ""))) &&
												i.appendChild(l),
											(t = i),
											(e = t))
										: e && 0 === e.innerText.replace(o).length
											? ((e = r.querySelector("div.citation")), (t = e))
											: e &&
												((l = e.querySelector("ul, ol, p")),
												(t = l || cleanText(e))),
								(n.popper.style.height = "auto"))
							: (n.popper.style.height = calculateHeight(e)),
							(n.popper.placement =
								position[Math.floor(Math.random() * position.length)]),
							e && 0 < e.innerText.length
								? (n.setContent(() => {
										var e = document.createElement("div");
										return (e.innerHTML = t ? t.outerHTML : ""), e;
									}),
									(n.popper.style.height = calculateHeight(t)))
								: ((e = r.querySelector("article")),
									n.reference.href.replace(/.*#/, "#"),
									(n.popper.style.height = calculateHeight(e)));
					}
				})
				.catch((e) => {
					console.log(e), n.hide(), n.destroy();
				});
		},
	});
} catch {
	console.log("tippy error, ignore it");
}
