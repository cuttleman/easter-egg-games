#!/usr/bin/env node

const co = require("co");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const inquirer = require("inquirer");
const chalk = require("chalk");

const scripts = {
  clean: "lerna clean",
  bootstrap: "lerna bootstrap --hoist",
  build: "lerna run build --scope @mestus/",
  publish: "lerna publish",
  "Remove to tester": "npm uninstall -w ./packages/tester @mestus/",
  "Add to tester": "lerna add --scope tester @mestus/",
  "Start tester": "lerna run --scope tester start",
};

let selectedTarget = null;
let confirm = "yes";

const scriptKeys = Object.keys(scripts);

co(function* () {
  const gameTarget = fs.readdirSync(path.join("packages", "@mestus"));

  // Init question
  const { command } = yield inquirer.prompt([
    {
      type: "list",
      name: "command",
      loop: false,

      message: "Select Command",
      choices: [
        ...scriptKeys.slice(0, 2),
        { name: "-----------", disabled: true },
        ...scriptKeys.slice(2, 4),
        { name: "-----------", disabled: true },
        ...scriptKeys.slice(4),
      ],
    },
  ]);

  // If existed selecting values
  if (
    command === "build" ||
    command === "Add to tester" ||
    command === "Remove to tester"
  ) {
    ({ selectedTarget } = yield inquirer.prompt([
      {
        type: "list",
        name: "selectedTarget",
        message: "Select Games",
        choices: gameTarget,
      },
    ]));
  }

  // Confirm part
  ({ confirm } = yield inquirer.prompt([
    {
      type: "list",
      name: "confirm",
      message: "Really?",
      choices: ["yes", "no"],
    },
  ]));

  if (confirm === "yes") {
    const [cmd, ...args] = scripts[command].split(" ");
    const updatedScript = args.map((arg) =>
      arg.includes("@mestus/") ? `${arg}${selectedTarget}` : arg
    );

    spawn(cmd, updatedScript, { stdio: "inherit" });
  } else {
    console.log(chalk.bold(chalk.red("Command cancel")));
  }
}).catch((r) => {
  const msgLength = r.message.length;
  console.log();
  console.log(chalk.red("Error:"));
  console.log(chalk.red("=".repeat(msgLength + 6)));
  console.log();
  console.log(chalk.red(" ".repeat(2), r.message, " ".repeat(2)));
  console.log();
  console.log(chalk.red("=".repeat(msgLength + 6)));
  console.log("\n");
});
