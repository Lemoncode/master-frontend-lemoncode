import {File} from "./file";
import {Progress} from "./progress";

const file = new File();
file.length = 200;
file.sent = 0;

const progress = new Progress(file);
console.log(progress.getAsPercent()); // 0

file.sent = 100;
console.log(progress.getAsPercent()); // 50

file.sent = 150;
console.log(progress.getAsPercent()); // 75

file.sent = 200;
console.log(progress.getAsPercent()); // 100

