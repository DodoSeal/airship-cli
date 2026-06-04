import type { CLICommand } from "./CommandTypes.js";
import { input, select, confirm } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from '../util/Styles.js';
import { AirshipToken } from '../util/TokenManager.js';
import type { AirshipGame } from "../AirshipTypes.js";
import { RestartTool, StartTool } from "../cli.js";

const apiMap = {
    "Slug": "https://api.airship.gg/content/games/slug/",
    "GameId": "https://api.airship.gg/content/games/game-id/"
};

export const fetchGameCommand: CLICommand = {
    name: "fetch-game",
    description: "Returns data related to the specified game.",
    usage: "fetch-game <method: slug | gameId> <identifier: string>",
    requiresToken: false,
    execute: async () => {
        const fetchMethod = await select({ message: "Which method would you like to use?", choices: [
            "Slug",
            "GameId"
        ]});

        const gameIdentifier = await input({ message: `Please enter the ${fetchMethod}:` });

        for (let data of Object.entries(apiMap)) {
            const method = data[0];
            const url = data[1];

            if (method === fetchMethod) {
                fetch(url + gameIdentifier, {
                    method: "GET"
                }).then(raw => raw.text().then(data => {
                    const gameData = JSON.parse(data) as AirshipGame | {};
                    const entries = Object.entries(gameData);

                    if (entries.length === 0) {
                        PrintError(`Invalid ${fetchMethod}!`);
                    } else if (entries.length === 3) {
                        // const styledError = `${entries[0]?.[1]}`.replaceAll("username", "Username").replaceAll(",", ", ");
                        // PrintError(styledError);
                    };

                    console.dir(gameData, { depth: null });
                })).catch((err) => {
                    PrintError(err);
                });

                RestartTool();

                return;
            };
        };
    }
};