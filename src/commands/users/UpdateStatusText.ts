import { input } from "@inquirer/prompts";
import type { CLICommand } from "../CommandTypes.js";
import { RestartTool } from "../../cli.js";
import { GetUsernameAvailability } from "../../util/platform/GetUsernameAvailability.js";
import chalk from "chalk";
import { UpdateUser } from "../../util/platform/UpdateUser.js";

export const updateStatusTextCommand: CLICommand = {
    name: "update-status-text",
    displayName: "Update Status Text",
    description: "Set your profile status.",
    usage: "update-status-text <status: string | undefined>",
    requiresToken: true,
    execute: async () => {
        const newStatus = await input({ message: "Enter a Status Text:" });
        const updateRequest = await UpdateUser({ statusText: newStatus });

        console.log(`\n`);

        if ("message" in updateRequest) {
            console.log(`${chalk.red(updateRequest.message)}`);
        } else {
            console.log(`Your status text has been updated to ${chalk.blue(updateRequest.user.statusText)}`);
        };

        console.log(`\n`);

        RestartTool();
        return;
    }
};