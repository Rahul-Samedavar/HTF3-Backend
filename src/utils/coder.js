const TEAM_SECRET = process.env.TEAM_SECRET;

export function getTeamCode(teamID) {
    if (!Number.isInteger(teamID)) {
        throw new Error("teamID must be an integer");
    }
    const obfuscated = teamID ^ TEAM_SECRET;

    return obfuscated.toString(36).toUpperCase();
}

export function parseTeamCode(teamCode) {
    if (typeof teamCode !== "string") {
        throw new Error("teamCode must be a string");
    }
    const obfuscated = parseInt(teamCode, 36);
    return obfuscated ^ TEAM_SECRET;
}