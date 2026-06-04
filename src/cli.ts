#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from './util/Styles.js';
import { AirshipToken } from './util/TokenManager.js';
import { helpCommand } from './commands/Help.js';
import { fetchUserCommand } from './commands/FetchUser.js';
import { fetchGameCommand } from './commands/FetchGame.js';

export const commandMap = {
    "Help": helpCommand,
    "Fetch User": fetchUserCommand,
    "Fetch Game": fetchGameCommand
};

export const commandList = [
    "Help",
    "Fetch User",
    "Fetch Game"
];

export function StartTool() {
    PrintTitle();

    setTimeout(() => {
        PromptCommand();
    }, 250);
};

StartTool();

async function PromptCommand() {
    const answer = await select({ message: "What would you like to do?", choices: commandList});

    for (let command of Object.entries(commandMap)) {
        const cmdName = command[0];
        const cmdFunction = command[1];

        if (answer === cmdName) {
            PrintTitle();

            setTimeout(() => {
                cmdFunction.execute();
            }, 250);
            return;
        };
    };
};