import chalk from "chalk";
import type { AirshipError, AirshipGame } from "../../AirshipTypes.js";
import { ConvertSlugToGameId } from "../IdentifierConversion.js";
import { AirshipToken } from "../TokenManager.js";

const apiPath = "https://api.airship.gg/content/favorites/GAME";

export async function FavoriteGame(fetchMethod: string, gameIdentifier: string, isFavorite: boolean): Promise<{} | AirshipError> {
    const gameId = fetchMethod === "Slug" ? await ConvertSlugToGameId(gameIdentifier) : gameIdentifier;
    if (gameId === false) {
        // TODO: Handle Error!
        return {} as AirshipError;
    };
    
    const request = await fetch(apiPath, {
        method: "POST",
        body: JSON.stringify({
            "resourceId": gameId,
            "isFavorite": isFavorite
        }),
        headers: {
            "Authorization": AirshipToken!,
            "Content-Type": "application/json"
        }
    });
    const data = await request.text();
    const result = data ? JSON.parse(data) as {} | AirshipError : chalk.green(`\nSuccessfully set Favorite to "${isFavorite}" on "${gameIdentifier}"!\n`);

    return result;
};