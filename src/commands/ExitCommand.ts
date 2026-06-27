import { setTimeout } from "node:timers/promises";
import type { CLICommand } from "./CommandTypes.js";

export const exitCommand: CLICommand = {
    name: "exit",
    displayName: "Exit",
    description: "Exits the CLI tool.",
    usage: "exit",
    requiresToken: false,
    execute: async () => {
        console.clear();
        process.exit(0);
    }
};