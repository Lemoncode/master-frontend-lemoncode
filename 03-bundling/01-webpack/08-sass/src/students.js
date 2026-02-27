import { getAvg } from "./averageService.js";
import "./mystyles.scss";

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);

const messageToDisplayAvg = `average score ${averageScore} `;

const messageElement = document.createElement("p");
messageElement.textContent = messageToDisplayAvg;
document.body.appendChild(messageElement);
