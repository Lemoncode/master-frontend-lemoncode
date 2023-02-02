import {Progress} from "./progress";
import {Audio} from "./audio";

const audio = new Audio();
audio.duration = 200;
audio.played = 0;

const progress = new Progress(audio);
console.log(progress.getAsPercent()); // 0

audio.played = 100;
console.log(progress.getAsPercent()); // 50

audio.played = 150;
console.log(progress.getAsPercent()); // 75

audio.played = 200;
console.log(progress.getAsPercent()); // 100

