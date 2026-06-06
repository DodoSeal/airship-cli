import * as fs from 'fs';
import type { AccountInfo } from '../AirshipTypes.js';
import { PrintError } from './Styles.js';
import path from 'path';

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

function FetchAirshipToken(): string | undefined {
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

export const AirshipToken = FetchAirshipToken();