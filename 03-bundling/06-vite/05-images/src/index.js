import "./mystyles.scss";
import logoImg from "./content/logo_1.png";

const user = "John Doe";

console.log(`Hello ${user}!`);
console.log("This app is using Vite");

const img = document.createElement("img");
img.src = logoImg;

document.getElementById("imgContainer").appendChild(img);
