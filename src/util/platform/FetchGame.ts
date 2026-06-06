import type { AirshipError, AirshipGame } from "../../AirshipTypes.js";

export const gameApiMap: { [key: string]: string } = {
    "Slug": "https://api.airship.gg/content/games/slug/",
    "GameId": "https://api.airship.gg/content/games/game-id/"
};

export async function FetchGame(fetchMethod: string, gameIdentifier: string): Promise<AirshipGame | AirshipError> {
    const request = await fetch(gameApiMap[fetchMethod] + gameIdentifier, {
        method: "GET"
    });
    const data = await request.text();
    const result = JSON.parse(data) as AirshipGame | AirshipError;

    return result;
};