#!/usr/bin/env node

import { confirm, input, select } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from './util/Styles.js';
import { AirshipToken } from './util/TokenManager.js';
import { helpCommand } from './commands/HelpCommand.js';
import { fetchUserCommand } from './commands/users/FetchUser.js';
import { fetchGameCommand } from './commands/games/FetchGame.js';
import { setTimeout } from 'node:timers/promises';
import { fetchProfilePhotoCommand } from './commands/users/FetchProfilePhoto.js';
import type { CLICommand } from './commands/CommandTypes.js';
import { favoriteGameCommand } from './commands/games/FavoriteGame.js';
import { restartCommand } from './commands/RestartCommand.js';
import { exitCommand } from './commands/ExitCommand.js';

interface CommandMap {
    "default": {
        [key: string]: CLICommand
    },

    [key: string]: {
        [key: string]: CLICommand
    }
};

export const commandMap: CommandMap = {
    "default": {
        "Help": helpCommand,
        "Exit": exitCommand
    },
    "Users": {
        "Fetch User": fetchUserCommand,
        "Fetch Profile Photo": fetchProfilePhotoCommand
    },
    "Games": {
        "Fetch Game": fetchGameCommand,
        "Favorite Game": favoriteGameCommand
    }
};

export async function StartTool() {
    PrintTitle();

    await setTimeout(250);
    PromptCommand();
};

export async function RestartTool() {
    try {
        await setTimeout(800);
        const restartTool = await confirm({ message: "Would you like to anything else?" });

        if (restartTool) {
            StartTool();
        };
    } catch(err) {
        console.error(err);
        process.exit(0);
    };
};

async function PromptCommand() {
    try {
        // Remove "default" from choices
        let choices: string[] = Object.keys(commandMap).slice(1);

        // Readd the default commands yay!
        for (let defaultCmd of Object.keys(commandMap.default)) {
            choices.push(defaultCmd);
        };

        const categoryAnswer = await select({ message: "What would you like to do?", choices});
        const cmdCategories = Object.entries(commandMap);

        for (let [ categoryName, commands ] of cmdCategories) {
            // Handle special exceptions for commands in default category
            if (categoryName !== "default") {
                commands["Back"] = restartCommand;
                return;
            };

            if (categoryAnswer === "Help") {
                helpCommand.execute();
                return;
            };

            if (categoryAnswer === "Exit") {
                exitCommand.execute();
                return;
            };

            if (categoryAnswer === categoryName) {
                const cmdAnswer = await select({ message: "What would you like to do?", choices: Object.keys(commands) });

                HandleCommand(commands[cmdAnswer]!, cmdAnswer);
            };
        };
    } catch(err) {
        console.error(err);
        process.exit(0);
    };
};

async function HandleCommand(command: CLICommand, answer: string) {
    const cmdName = command.displayName;
    const requiresToken = command.requiresToken;
    const cmdFunction = command

    if (answer === cmdName) {
        if (AirshipToken === undefined && requiresToken) {
            PrintError("An authenticated Airship installation is required to run this command!");
            process.exit(1);
        };

        await setTimeout(250);
        cmdFunction.execute();
        return;
    };
};

// process.on("exit", (signal) => {
//     if (signal === 0) {
//         console.clear();
//     };
// });

StartTool();