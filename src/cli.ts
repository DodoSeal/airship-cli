#!/usr/bin/env node

import { confirm, input, select } from '@inquirer/prompts';
import { PrintHeader, PrintError, PrintTitle } from './util/Styles.js';
import { AirshipToken } from './util/TokenManager.js';
import { helpCommand } from './commands/Help.js';
import { fetchUserCommand } from './commands/FetchUser.js';
import { fetchGameCommand } from './commands/FetchGame.js';
import { setTimeout } from 'node:timers/promises';

export const commandMap = {
    "Help": helpCommand,
    "Fetch User": fetchUserCommand,
    "Fetch Game": fetchGameCommand
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
        const answer = await select({ message: "What would you like to do?", choices: Object.keys(commandMap)});

        for (let command of Object.entries(commandMap)) {
            const cmdName = command[0];
            const requiresToken = command[1].requiresToken;
            const cmdFunction = command[1];

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
    } catch(err) {
        process.exit(0);
    };
};

process.on("exit", (signal) => {
    if (signal === 0) {
        console.clear();
    };
});

StartTool();