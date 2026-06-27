import { input, select } from "@inquirer/prompts";
import type { CLICommand } from "../CommandTypes.js";
import { FetchGame, gameApiMap } from "../../util/platform/FetchGame.js";
import { FavoriteGame } from "../../util/platform/FavoriteGame.js";
import { RestartTool } from "../../cli.js";

export const favoriteGameCommand: CLICommand = {
    name: "favorite-game",
    displayName: "Favorite Game",
    description: "Mark a game as your favorite. Requires Auth Token!",
    usage: "favorite-game <action: Favorite | Remove Favorite> <method: Slug | GameId> <identifier: string> <isFavorite?: boolean>",
    requiresToken: true,
    execute: async () => {
        const action = await select({ message: "What would you like to do?", choices: [ "Favorite", "Remove Favorite" ] });
        const fetchType = await select({ message: "Which method would you like to use?", choices: Object.keys(gameApiMap) });
        const gameIdentifier = await input({ message: `What is the ${fetchType}?` });

        const isFavorite = action === "Favorite" ? true : false;
        const result = await FavoriteGame(fetchType, gameIdentifier, isFavorite);

        console.log(result);

        RestartTool();
        return;
    }
};