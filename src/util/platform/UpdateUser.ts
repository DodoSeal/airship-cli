import type { AirshipError, AirshipUser, UpdateUserDTO } from "../../AirshipTypes.js";
import { AirshipToken } from "../TokenManager.js";

export async function UpdateUser(updateInfo: UpdateUserDTO): Promise<AirshipUser | AirshipError> {
    const request = await fetch("https://api.airship.gg/game-coordinator/users", {
        method: "PATCH",
        headers: {
            "Authorization": AirshipToken!,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateInfo)
    });
    const data = await request.text();
    const result = JSON.parse(data)

    return result;
};