export type AccountInfo = {
    refreshToken: string,
    time: number
};

export type AirshipUser = {
    user: {
        uid: string,
        username: string,
        usernameLower: string,
        statusText?: string,
        profileImageId?: string,
        lastOnlineTime?: string
    }
};

export type AirshipError = {
    message: string[],
    error: string,
    statusCode: number
};

export type AirshipOrganization = {
    id: string,
    slug: string,
    slugProperCase: string,
    name: string,
    description: string | null,
    iconImageId: string,
    createdAt: string,
    adminBanned: boolean
}

type GameLink = {
    type: "DISCORD",
    url: string
};

export type AirshipGame = {
    game: {
        id: string,
        slug: string | null,
        slugProperCase: string | null,
        name: string,
        description: string | null,
        iconImageId: string,
        organizationId: string,
        createdAt: string,
        visibility: "PUBLIC" | "UNLISTED" | "PRIVATE",
        lastVersionUpdate: string,
        archivedAt: string | null,
        loadingScreenImageId: string | null,
        logoImageId: string | null,
        videoId: string | null,
        links: GameLink[],
        plays: number,
        favorites: number,
        plays24h: number,
        uniquePlays24h: number,
        platforms: string[],
        organization: AirshipOrganization
    }
};