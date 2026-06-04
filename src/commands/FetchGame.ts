import type { CLICommand } from "./CommandTypes.js";
import { input, select, confirm } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from '../util/Styles.js';
import { AirshipToken } from '../util/TokenManager.js';
import type { AirshipError, AirshipGame } from "../AirshipTypes.js";
import { RestartTool, StartTool } from "../cli.js";
import { setTimeout } from "node:timers/promises";
import chalk from "chalk";

const apiMap = {
    "Slug": "https://api.airship.gg/content/games/slug/",
    "GameId": "https://api.airship.gg/content/games/game-id/"
};

export const fetchGameCommand: CLICommand = {
    name: "fetch-game",
    displayName: "Fetch Game",
    description: "Returns data related to the specified game.",
    usage: "fetch-game <method: slug | gameId> <identifier: string>",
    requiresToken: false,
    execute: async () => {
        console.clear();
        PrintHeader("Fetch Game");

        await setTimeout(250);

        const fetchMethod = await select({ message: "Which method would you like to use?", choices: [
            "Slug",
            "GameId"
        ]});

        const gameIdentifier = await input({ message: `Please enter the ${fetchMethod}:` });
        const dataType = await select({ message: "How would you like your data?", choices: [ "Simple", "Verbose" ] });

        for (let data of Object.entries(apiMap)) {
            const method = data[0];
            const url = data[1];

            if (method === fetchMethod) {
                fetch(url + gameIdentifier, {
                    method: "GET"
                }).then(raw => raw.text().then(data => {
                    const result = JSON.parse(data) as AirshipGame | AirshipError | {};
                    const entries = Object.entries(result);

                    if (entries.length === 0) {
                        PrintError(`Invalid ${fetchMethod}!`);
                        return;
                    };

                    if ((result as AirshipError)["error"]) return;

                    switch(dataType) {
                        case "Simple":
                            const userData = (result as AirshipGame).game;

                            console.log(`\n${chalk.green("Game Id")}: ${userData.id}`);
                            console.log(`${chalk.green("Name")}: ${userData.name}`);
                            console.log(`${chalk.green("Slug")}: ${userData.slug || ""}`);
                            console.log(`${chalk.green("Developer")}: ${userData.organization.name}`);
                            console.log(`${chalk.green("Description")}: ${userData.description || ""}\n`);
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