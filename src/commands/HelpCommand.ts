import type { CLICommand } from "./CommandTypes.js";
import chalk from "chalk";
import { input, select, confirm } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from '../util/Styles.js';
import { AirshipToken } from '../util/TokenManager.js';
import { commandMap, RestartTool, StartTool } from "../cli.js";

export const helpCommand: CLICommand = {
    name: "help",
    displayName: "Help",
    description: "Returns the usage of a command.",
    usage: "help <command: string>",
    requiresToken: false,
    execute: async () => {
        let helpInfo: CLICommand[] = [];
        let choices: string[] = [];

        for (let [ categoryName, category ] of Object.entries(commandMap)) {
            if (categoryName === "default") continue;

            for (let [ cmdName, cmd ] of Object.entries(category)) {
                helpInfo.push(cmd);
                choices.push(cmdName);
            };
        };

        const commandSelect = await select({ message: "Which command do you need help with?", choices });

        for (let command of helpInfo) {
            if (command.displayName === commandSelect) {
                console.log(`\n${chalk.bold(chalk.green(`${commandSelect} Help:`))}`);
                console.log(`- Description: ${chalk.gray(command.description)}`);
                console.log(`- Usage: ${chalk.gray(command.usage)}\n`);
            };
        };

        RestartTool();
        return;
    }
};