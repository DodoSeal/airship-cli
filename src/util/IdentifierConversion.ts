import { FetchGame } from "./platform/FetchGame.js";

export async function ConvertSlugToGameId(slug: string): Promise<string | boolean> {
    const result = await FetchGame("Slug", slug);
    const entries = Object.entries(result);
    
    if (entries.length === 0 || "error" in result) {
        // TODO: Handle Error!
        return false;
    };

    const game = result.game;
    return game.id;
};