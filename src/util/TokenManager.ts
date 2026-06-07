import * as fs from 'fs';
import type { AccessTokenError, AccessTokenResult, AccountInfo } from '../AirshipTypes.js';
import { PrintError } from './Styles.js';
import path, { join } from 'path';

const firebaseApiKey = "AIzaSyAYw0C18Mt3wijT0ZHKGcS7zVdaPlR_sGI";

// Ya'know, this is probably horrific but who cares!
const platformPathMap: { [key: string]: string } = {
    "win32": path.join(`${process.env.APPDATA}`, `../../LocalLow`),
    "darwin": path.join(`${process.env.HOME}`, "Library", "Preferences"),
    "linux": path.join(`${process.env.HOME}` as string, ".steam/steam/steamapps/compatdata/2381730/pfx/drive_c/users/steamuser/AppData/LocalLow")
};

function GetApplicationPath() {
    const platform = process.platform;
    const applicationPath = platformPathMap[platform];

    return applicationPath;
};

function FetchAirshipRefreshToken(): string | undefined {
    let jsonData: AccountInfo;
    const airshipAccountPath = path.join(GetApplicationPath() + `/Easy/Airship/account.json`);

    try {
        const accountsFile = fs.readFileSync(airshipAccountPath);
        
        jsonData = JSON.parse(accountsFile.toString("utf8"));
    } catch(err) {
        PrintError("No Airship Installation Found!");
        return undefined;
    };

    return jsonData.refreshToken;
};

async function UseRefreshToken(): Promise<string | undefined> {
    const refreshToken = FetchAirshipRefreshToken();
    if (refreshToken === undefined) {
        // TODO: Handle Error!
        return;
    };

    const body = `grantType=refresh_token&refresh_token=${refreshToken}`;
    const request = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseApiKey}&${body}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    const data = await request.text();
    const result = JSON.parse(data) as AccessTokenResult | AccessTokenError;

    if ("error" in result) {
        // TODO: Handle Error!
        return;
    };

    // const newRefresh = result.refresh_token;
    const accessToken = result.access_token;

    return "Bearer " + accessToken;
};

UseRefreshToken();

export const AirshipToken = await UseRefreshToken();