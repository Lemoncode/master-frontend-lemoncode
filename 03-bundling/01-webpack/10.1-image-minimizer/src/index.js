import { getAvg } from "./averageService";
import gifImage from "./content/lemon_gif.gif";
import jpgImage from "./content/lemon_jpg.jpg";
import pngImage from "./content/lemon_png.png";
import svgImage from "./content/lemon_svg.svg";

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);
const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);

const imageGif = document.createElement("img");
imageGif.src = gifImage;
const imagejpg = document.createElement("img");
imagejpg.src = jpgImage;
const imagePng = document.createElement("img");
imagePng.src = pngImage;
const imageSvg = document.createElement("img");
imageSvg.src = svgImage;

document.getElementById("gifImg").appendChild(imageGif);
document.getElementById("jpgImg").appendChild(imagejpg);
document.getElementById("pngImg").appendChild(imagePng);
document.getElementById("svgImg").appendChild(imageSvg);
