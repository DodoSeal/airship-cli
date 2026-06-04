import type { CLICommand } from "./CommandTypes.js";
import chalk from "chalk";
import { input, select, confirm } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from '../util/Styles.js';
import { AirshipToken } from '../util/TokenManager.js';
import { commandMap, StartTool } from "../cli.js";

export const helpCommand: CLICommand = {
    name: "help",
    displayName: "Help",
    description: "Returns the usage of a command.",
    usage: "help <command: string>",
    requiresToken: false,
    execute: async () => {
        const commandSelect = await select({ message: "Which command do you need help with?", choices: Object.keys(commandMap).slice(1) });

        for (let command of Object.entries(commandMap)) {
            if (command[0] === commandSelect) {
                console.log(`\n`);
                console.log(`${chalk.bold(chalk.green(`${commandSelect} Help:`))}`);
                console.log(`- Description: ${chalk.gray(command[1].description)}`);
                console.log(`- Usage: ${chalk.gray(command[1].usage)}`);
                console.log(`\n`);

                setTimeout(async () => {
                    const restartTool = await confirm({ message: "Would you like to anything else?" });

                    if (restartTool) {
                        StartTool();
                    };
                }, 0);

                return;
            };
        };
    }
};