import { StartTool } from "../cli.js";
import type { CLICommand } from "./CommandTypes.js";

export const restartCommand: CLICommand = {
    name: "back",
    displayName: "Back",
    description: "Returns to the main command list.",
    usage: "back",
    requiresToken: false,
    execute: async () => {
        console.clear();

        StartTool();
        return;
    }
};