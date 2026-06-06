import type { CLICommand } from "./CommandTypes.js";
import { PrintError } from "../util/Styles.js";
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { RestartTool } from "../cli.js";
import { FetchUser, userApiMap } from "../util/platform/FetchUser.js";

export const FetchProfilePhotoCommand: CLICommand = {
    name: "fetch-profile-photo",
    displayName: "Fetch Profile Photo",
    description: "Returns the profile picture of the given user.",
    usage: "<method: username | userId> <identifier: string>",
    requiresToken: false,
    execute: async () => {
        const fetchMethod = await select({ message: "Which method would you like to use?", choices: Object.keys(userApiMap)});
        const userIdentifier = await input({ message: `Please enter the ${fetchMethod}:` });
        
        const result = await FetchUser(fetchMethod, userIdentifier);
        const entries = Object.entries(result);
        const keys = Object.keys(result);
        
        if (entries.length === 0 || keys.length === 0 || "error" in result) {
            return PrintError(`Invalid ${fetchMethod}`);
        };

        const user = result.user;
        const profileImageId = user.profileImageId;
        if (!profileImageId) return PrintError("User has no profile image!");

        console.log(chalk.green(`\nhttps://cdn.airship.gg/images/${profileImageId}\n`));

        RestartTool();
        return;
    }
};