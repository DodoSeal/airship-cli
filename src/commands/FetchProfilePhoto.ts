import { setTimeout } from "node:timers/promises";
import type { CLICommand } from "./CommandTypes.js";
import { PrintError, PrintHeader } from "../util/Styles.js";
import { input, select } from "@inquirer/prompts";
import type { AirshipError, AirshipUser } from "../AirshipTypes.js";
import chalk from "chalk";
import { RestartTool } from "../cli.js";

const apiMap: { [key: string]: string } = {
    "Username": "https://api.airship.gg/game-coordinator/users/user?username=",
    "UserId": "https://api.airship.gg/game-coordinator/users/uid/"
};

export const FetchProfilePhotoCommand: CLICommand = {
    name: "fetch-profile-photo",
    displayName: "Fetch Profile Photo",
    description: "Returns the profile picture of the given user.",
    usage: "<method: username | userId> <identifier: string>",
    requiresToken: false,
    execute: async () => {
        const fetchMethod = await select({ message: "Which method would you like to use?", choices: Object.keys(apiMap)});
        const userIdentifier = await input({ message: `Please enter the ${fetchMethod}:` });
        
        // for (let [ method, url ] of Object.entries(apiMap)) {
        //     if (method === fetchMethod) {
        //         fetch(url )
        //     };
        // };

        fetch(apiMap[fetchMethod] + userIdentifier, {
            method: "GET"
        }).then((raw) => raw.text().then((data) => {
            const result = JSON.parse(data) as AirshipUser | AirshipError;
            const keys = Object.keys(result);
            const entries = Object.entries(result);
            
            if (entries.length === 0 || "error" in result || keys.length === 0) {
                PrintError(`Invalid ${fetchMethod}!`);
                return;
            };

            const user = result.user;
            const profileImageId = user.profileImageId;
            if (!profileImageId) return PrintError("User has no profile image!");

            console.log(chalk.green(`\nhttps://cdn.airship.gg/images/${profileImageId}\n`));
        }));

        RestartTool();
        
        return;
    }
};