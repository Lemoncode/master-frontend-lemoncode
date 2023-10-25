document.getElementById("submit").addEventListener("click", function (e) {
	const input = document.getElementById("name") as HTMLInputElement | null;
	const contenido = input?.value;

	document.getElementById("result").innerHTML = contenido;
});
