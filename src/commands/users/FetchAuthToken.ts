import { RestartTool } from "../../cli.js";
import { AirshipToken } from "../../util/TokenManager.js";
import type { CLICommand } from "../CommandTypes.js";

export const fetchAuthTokenCommand: CLICommand = {
    name: "fetch-auth-token",
    displayName: "Fetch Auth Token",
    description: "Returns your Airship Authentication Bearer Token.",
    usage: "fetch-auth-token",
    requiresToken: true,
    execute: async () => {
        if (AirshipToken !== undefined) {
            console.log(`\n${AirshipToken}\n`);
        } else {
            console.log(`There was an issue finding your account information.`);
        };

        RestartTool();
        return;
    }
};