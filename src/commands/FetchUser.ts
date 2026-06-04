import type { CLICommand } from "./CommandTypes.js";
import { input, select, confirm } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from '../util/Styles.js';
import { AirshipToken } from '../util/TokenManager.js';
import type { AirshipUser, AirshipUserError } from "../AirshipTypes.js";
import { RestartTool, StartTool } from "../cli.js";

const apiMap = {
    "Username": "https://api.airship.gg/game-coordinator/users/user?username=",
    "UserId": "https://api.airship.gg/game-coordinator/users/uid/"
};

export const fetchUserCommand: CLICommand = {
    name: "fetch-user",
    description: "Returns data related to the specified user.",
    usage: "fetch-user <method: username | userId> <identifier: string>",
    requiresToken: false,
    execute: async () => {
        const fetchMethod = await select({ message: "Which method would you like to use?", choices: [
            "Username",
            "UserId"
        ]});

        const userIdentifier = await input({ message: `Please enter the ${fetchMethod}:` });

        for (let data of Object.entries(apiMap)) {
            const method = data[0];
            const url = data[1];

            if (method === fetchMethod) {
                fetch(url + userIdentifier, {
                    method: "GET"
                }).then(raw => raw.text().then(data => {
                    const userData = JSON.parse(data) as AirshipUser | AirshipUserError | {};
                    const entries = Object.entries(userData);

                    if (entries.length === 0) {
                        PrintError(`Invalid ${fetchMethod}!`);
                    } else if (entries.length === 3) {
                        const styledError = `${entries[0]?.[1]}`.replaceAll("username", "Username").replaceAll(",", ", ");
                        PrintError(styledError);
                    };

                    console.dir(userData, { depth: null });
                })).catch((err) => {
                    PrintError(err);
                });

                RestartTool();

                return;
            };
        };
    }
};