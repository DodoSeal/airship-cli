import type { AirshipError, AirshipUser } from "../../AirshipTypes.js";

export const userApiMap: { [key: string]: string } = {
    "Username": "https://api.airship.gg/game-coordinator/users/user?username=",
    "UserId": "https://api.airship.gg/game-coordinator/users/uid/"
};

export async function FetchUser(fetchMethod: string, userIdentifier: string): Promise<AirshipUser | AirshipError> {
    const request = await fetch(userApiMap[fetchMethod] + userIdentifier, {
        method: "GET"
    });
    const data = await request.text();
    const result = JSON.parse(data) as AirshipUser | AirshipError;

    return result;
};