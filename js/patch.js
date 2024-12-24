
/**
 * @file Misc
 * @description Various file links and patch I was to lazy to do in mkdocs
 */


//patch a href attributes
const header_links = document.querySelectorAll("a[href*=\"#\"]");
if (header_links) {
	for (var i = 0; i < header_links.length; i++) {
		const header = header_links[i].getAttribute("href").replace("^.*#", "");
		//replace " " with "-"
		let header_fix = header.replace(/\s/g, "-");
		//replace any accent with the corresponding letter
		header_fix = header.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		header_links[i].setAttribute(
			"href",
			header_links[i].getAttribute("href").replace(header, header_fix)
		);
	}
}


for (const i of document.querySelectorAll("img")) {
	const resize = /^(?<alt>(?!^\d*x?\d*$).*?)?(\|?\s*?(?<width>\d+)(x(?<height>\d+))?)?$/gi;
	if (i.alt.match(resize)) {
		const match = resize.exec(i.alt ?? "");
		i.width = match.groups.width ?? i.width;
		i.height = match.groups.height ?? i.height;
		i.alt = match.groups.alt ?? i.alt;

	}
}

//remove ^id from contents ;
// Only work in the form of "content ^id" (and ^id must end the lines)
const article = document.querySelectorAll(
	"article.md-content__inner.md-typeset > *:not(.highlight)"
);
const embed_id_regex = /\^\w+\s*$/gi;
for (const element of article) {
	const embed_id = element.innerText.match(embed_id_regex);
	if (embed_id) {
		element.innerHTML = element.innerText.replace(embed_id, "");
	}
}
document.innerText = article;

const cite = document.querySelectorAll(".citation");
if (cite) {
	for (const elem of cite) {
		const img_cite = elem.innerHTML.match(/!?(\[{2}|\[).*(\]{2}|\))/gi);
		if (img_cite) {
			for (const element of img_cite) {
				elem.innerHTML = elem.innerHTML.replace(element, "");
			}
			if (elem.innerText.trim().length < 2) {
				elem.style.display = "none";
			}
		}
	}
}

