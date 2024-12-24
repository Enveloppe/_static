const paletteSwitcher1 = document.getElementById("__palette_1");
const paletteSwitcher2 = document.getElementById("__palette_2");

const isMermaidPage = document.querySelector(".mermaid");
if (isMermaidPage) {
	paletteSwitcher1.addEventListener("change", () => {
		location.reload();
	});

	paletteSwitcher2.addEventListener("change", () => {
		location.reload();
	});
}
