import { AirshipToken } from "../TokenManager.js";

export async function GetUsernameAvailability(username: string): Promise<true | false> {
    const request = await fetch(`https://api.airship.gg/game-coordinator/users/availability?username=${username}`, {
        method: "GET",
        headers: {
            "Authorization": AirshipToken!
        }
    });
    const data = await request.text();
    const result = JSON.parse(data) as { available: boolean };

    return result.available;
};