import type { CLICommand } from "./CommandTypes.js";
import { input, select } from '@inquirer/prompts';
import type { AirshipError, AirshipGame } from "../AirshipTypes.js";
import { RestartTool } from "../cli.js";
import { FetchGame, gameApiMap } from "../util/platform/FetchGame.js";
import { PrintError } from "../util/Styles.js";
import chalk from "chalk";

export const fetchGameCommand: CLICommand = {
    name: "fetch-game",
    displayName: "Fetch Game",
    description: "Returns data related to the specified game.",
    usage: "fetch-game <method: slug | gameId> <identifier: string>",
    requiresToken: false,
    execute: async () => {
        const fetchMethod = await select({ message: "Which method would you like to use?", choices: Object.keys(gameApiMap)});
        const dataType = await select({ message: "How would you like your data?", choices: [ "Simple", "Verbose" ] });
        const gameIdentifier = await input({ message: `Please enter the ${fetchMethod}:` });
        
        const result = await FetchGame(fetchMethod, gameIdentifier);
        const entries = Object.entries(result);
        const keys = Object.keys(result);

        if (entries.length === 0 || keys.length === 0 || "error" in result) {
            return PrintError(`Invalid ${fetchMethod}`);
        };

        const game = result.game;
        
        switch(dataType) {
            case "Simple":
                console.log(`\n${chalk.green("Game Id")}: ${game.id}`);
                console.log(`${chalk.green("Name")}: ${game.name}`);
                console.log(`${chalk.green("Slug")}: ${game.slug || ""}`);
                console.log(`${chalk.green("Developer")}: ${game.organization.name}`);
                console.log(`${chalk.green("Description")}: ${game.description || ""}\n`);
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