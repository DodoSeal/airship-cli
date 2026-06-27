import type { CLICommand } from "../CommandTypes.js";
import { input, select } from '@inquirer/prompts';
import { PrintError } from '../../util/Styles.js';
import { RestartTool } from "../../cli.js";
import chalk from "chalk";
import { FetchUser, userApiMap } from "../../util/platform/FetchUser.js";

export const fetchUserCommand: CLICommand = {
    name: "fetch-user",
    displayName: "Fetch User",
    description: "Returns data related to the specified user.",
    usage: "fetch-user <method: username | userId> <identifier: string>",
    requiresToken: false,
    execute: async () => {
        const fetchMethod = await select({ message: "Which method would you like to use?", choices: Object.keys(userApiMap)});
        const dataType = await select({ message: "How would you like your data?", choices: [ "Simple", "Verbose" ] });
        const userIdentifier = await input({ message: `Please enter the ${fetchMethod}:` });

        const result = await FetchUser(fetchMethod, userIdentifier);
        const entries = Object.entries(result);
        const keys = Object.keys(result);
        
        if (entries.length === 0 || keys.length === 0 || "error" in result) {
            return PrintError(`Invalid ${fetchMethod}`);
        };

        const user = result.user;
        switch(dataType) {
            case "Simple":
                console.log(`\n${chalk.green("User Id")}: ${user.uid}`);
                console.log(`${chalk.green("Username")}: ${user.username}`);
                console.log(`${chalk.green("Status Text")}: ${user.statusText || ""}\n`);
                break;
            case "Verbose":
                console.dir(result, { depth: null });
                console.log();
                break;
        };

        RestartTool();
        return;
    }
};