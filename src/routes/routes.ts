import { AuthenticationMethod } from "../authentication/AuthenticationMethod";
import { UserVerifiedMethod } from "../authentication/UserVerifiedMethod";

type SearchOptions = {
    q: string,
    type: ("album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook")[],
    market?: string,
    limit?: number,
    offset?: number,
    include_external?: string
}

export interface SpotifyProfileStruct {
    readonly id: string,
    readonly display_name: string,
    readonly external_urls: any,
    readonly href: string,
    readonly followers: any,
    readonly images: any[],
    readonly type: string,
}

export class BasicRoutes {

    protected readonly authMethod: AuthenticationMethod;

    constructor(authMethod: AuthenticationMethod) {
        this.authMethod = authMethod;
    }

    public async search(options: SearchOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/search");
        for(const [key, value] of Object.entries(options))
            uri.searchParams.append(key, value as string);

        const response: Response = await fetch(uri, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.authMethod.token?.access_token
            }
        });

        if (!response.ok)
            return Promise.reject("Unable to search! Status code: " + response.status);

        return await response.json();
    }

}

export class BearerRoutes extends BasicRoutes {

    constructor(authMethod: UserVerifiedMethod) {
        super(authMethod);
    }

    public async getCurrentProfile(): Promise<any> {
        const response: Response = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.authMethod.token?.access_token
            }
        });

        if (!response.ok)
            throw new Error("Unable to fetch current user profile! Status code: " + response.status);

        return await response.json();
    }

}