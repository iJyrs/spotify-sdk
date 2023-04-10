import { AuthenticationMethod } from "../authentication/AuthenticationMethod";
import { UserVerifiedMethod } from "../authentication/UserVerifiedMethod";
import { HttpApiError } from "../errors";

type SearchOptions = {
    q: string,
    type: ("album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook")[],
    market?: string,
    limit?: number,
    offset?: number,
    include_external?: string
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
            throw new HttpApiError("Unable to fetch search data! Status code: " + response.status);

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
            throw new HttpApiError("Unable to fetch current user profile! Status code: " + response.status);

        return await response.json();
    }

}