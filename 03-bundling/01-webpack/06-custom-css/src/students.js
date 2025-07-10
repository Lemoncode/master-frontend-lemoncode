import * as averageService from "./averageService.js";
import "./mystyles.css";

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = averageService.getAvg(scores);
const totalScore = averageService.getTotalScore(scores);

const messageToDisplayAvg = `average score ${averageScore} `;
const messageToDisplayTotal = `total score ${totalScore}`;

const messageElement = document.createElement("p");
messageElement.textContent = messageToDisplayAvg;
document.body.appendChild(messageElement);

const totalElement = document.createElement("p");
totalElement.textContent = messageToDisplayTotal;
document.body.appendChild(totalElement);
