import { input } from "@inquirer/prompts";
import type { CLICommand } from "../CommandTypes.js";
import { RestartTool } from "../../cli.js";
import { GetUsernameAvailability } from "../../util/platform/GetUsernameAvailability.js";
import chalk from "chalk";

export const fetchUsernameAvailabilityCommand: CLICommand = {
    name: "fetch-username-availability",
    displayName: "Fetch Username Availability",
    description: "Returns if the specified username is available",
    usage: "fetch-username-availability <username: string>",
    requiresToken: true,
    execute: async () => {
        const targetUsername = await input({ message: "Enter a username:" });
        const isAvailable = await GetUsernameAvailability(targetUsername);
        const returnValue = isAvailable ? chalk.green("available!") : chalk.red("not available!");

        console.log(`\nThe username ${chalk.blue(targetUsername)} is ${returnValue} \n`);

        RestartTool();
        return;
    }
};