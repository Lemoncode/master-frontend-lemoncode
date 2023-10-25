import { prompt } from "inquirer";

(async () => {
  let exit = false;
  while (!exit) {
    const answer = await prompt({
      name: "consoleRunner",
      type: "list",
      message: "Elige una opción para empezar",
      choices: ["seed-data", "find-without-sleep", "find-with-sleep", "exit"],
    });

    if (answer.consoleRunner !== "exit") {
      const { run } = require(`./helpers/${answer.consoleRunner}.runner`);
      await run();
    } else {
      exit = true;
    }
  }
})();
