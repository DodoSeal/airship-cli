#!/usr/bin/env node

import { confirm, input, select } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from './util/Styles.js';
import { AirshipToken } from './util/TokenManager.js';
import { helpCommand } from './commands/Help.js';
import { fetchUserCommand } from './commands/FetchUser.js';
import { fetchGameCommand } from './commands/FetchGame.js';
import { setTimeout } from 'node:timers/promises';
import { FetchProfilePhotoCommand } from './commands/FetchProfilePhoto.js';
import type { CLICommand } from './commands/CommandTypes.js';

interface CommandMap {
    [key: string]: {
        [key: string]: CLICommand
    }
};

// TODO: Make default category
export const commandMap: CommandMap = {
    /* "default": {
        "Help": helpCommand
    }, */
    "Users": {
        "Fetch User": fetchUserCommand,
        "Fetch Profile Photo": FetchProfilePhotoCommand
    },
    "Games": {
        "Fetch Game": fetchGameCommand
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
        process.exit(0);
    };
};

async function PromptCommand() {
    try {
        const categoryAnswer = await select({ message: "Select a command category:", choices: Object.keys(commandMap)});
        const cmdCategories = Object.entries(commandMap);

        for (let [ categoryName, commands ] of cmdCategories) {
            // TODO: Make back command

            if (categoryAnswer === categoryName) {
                const cmdAnswer = await select({ message: "What would you like to do?", choices: Object.keys(commands) });

                HandleCommand(commands[cmdAnswer]!, cmdAnswer);
            };
        };
    } catch(err) {
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

process.on("exit", (signal) => {
    if (signal === 0) {
        console.clear();
    };
});

StartTool();