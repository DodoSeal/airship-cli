export type CLICommand = {
    name: string,
    displayName: string,
    description: string,
    usage: string,
    requiresToken: boolean,
    execute: () => void
};