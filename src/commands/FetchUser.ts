import type { CLICommand } from "./CommandTypes.js";
import { input, select, confirm } from '@inquirer/prompts';
import { PrintError, PrintHeader, PrintTitle } from '../util/Styles.js';
import { AirshipToken } from '../util/TokenManager.js';
import type { AirshipUser, AirshipError } from "../AirshipTypes.js";
import { RestartTool, StartTool } from "../cli.js";
import chalk from "chalk";
import { setTimeout } from "node:timers/promises";

const apiMap = {
    "Username": "https://api.airship.gg/game-coordinator/users/user?username=",
    "UserId": "https://api.airship.gg/game-coordinator/users/uid/"
};

export const fetchUserCommand: CLICommand = {
    name: "fetch-user",
    displayName: "Fetch User",
    description: "Returns data related to the specified user.",
    usage: "fetch-user <method: username | userId> <identifier: string>",
    requiresToken: false,
    execute: async () => {
        console.clear();
        PrintHeader("Fetch User");

        await setTimeout(250);

        const fetchMethod = await select({ message: "Which method would you like to use?", choices: [
            "Username",
            "UserId"
        ]});

        const userIdentifier = await input({ message: `Please enter the ${fetchMethod}:` });
        const dataType = await select({ message: "How would you like your data?", choices: [ "Simple", "Verbose" ] });

        for (let data of Object.entries(apiMap)) {
            const method = data[0];
            const url = data[1];

            if (method === fetchMethod) {
                fetch(url + userIdentifier, {
                    method: "GET"
                }).then(raw => raw.text().then(data => {
                    const result = JSON.parse(data) as AirshipUser | AirshipError | {};
                    const keys = Object.keys(result);
                    const entries = Object.entries(result);

                    if (entries.length === 0) {
                        PrintError(`Invalid ${fetchMethod}!`);
                    };

                    if ("error" in result || keys.length === 0) return;

                    switch(dataType) {
                        case "Simple":
                            const userData = (result as AirshipUser).user;

                            console.log(`\n${chalk.green("User Id")}: ${userData.uid}`);
                            console.log(`${chalk.green("Username")}: ${userData.username}`);
                            console.log(`${chalk.green("Status Text")}: ${userData.statusText || ""}\n`);
                            break;
                        case "Verbose":
                            console.dir(result, { depth: null });
                            break;
                    };
                })).catch((err) => {
                    PrintError(err);
                });

                RestartTool();

                return;
            };
        };
    }
};