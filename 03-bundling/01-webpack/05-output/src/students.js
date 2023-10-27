import * as averageService from "./averageService.js";

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = averageService.getAvg(scores);
const totalScore = averageService.getTotalScore(scores);

const messageToDisplayAvg = `average score ${averageScore} `;
const messageToDisplayTotal = `total score ${totalScore}`;

document.write(messageToDisplayAvg);
document.write(messageToDisplayTotal);
