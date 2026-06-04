import * as fs from 'fs';
import type { AccountInfo } from '../AirshipTypes.js';
import { PrintError } from './Styles.js';

const airshipAccountPath = process.env.APPDATA + `../../LocalLow/Easy/Airship/account.json`;

function FetchAirshipToken(): string | undefined {
    let jsonData: AccountInfo;

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