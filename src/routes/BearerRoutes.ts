import { AuthenticationMethod } from "../authentication/AuthenticationMethod";
import { HttpApiError } from "../errors";

type SearchOptions = {
    q: string,
    type: ("album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook")[],
    market?: string,
    limit?: number,
    offset?: number,
    include_external?: string
}

type GetAlbumTracksOptions = {
    id: string,
    market?: string,
    limit?: number,
    offset?: number
}

type GetUsersSavedAlbumsOptions = {
    limit?: number,
    offset?: number,
    market?: string,
}

export class BearerRoutes {

    protected readonly authMethod: AuthenticationMethod;

    constructor(authMethod: AuthenticationMethod) {
        this.authMethod = authMethod;
    }

    public async search(options: SearchOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/search");
        for (const [key, value] of Object.entries(options))
            uri.searchParams.append(key, value as string);

        const response: Response = await fetch(uri, {
            method: "GET",
            headers: BearerRoutes.buildHeaders(this.authMethod.token?.access_token!)
        });

        if (!response.ok)
            throw new HttpApiError("Unable to fetch search data! Status code: " + response.status);

        return await response.json();
    }

    public async getAlbumById(id: string, market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/albums/" + id);

        if (market !== undefined)
            uri.searchParams.append("market", market);

        const response = await fetch(uri, {
            method: "GET",
            headers: BearerRoutes.buildHeaders(this.authMethod.token?.access_token!)
        });

        if (!response.ok)
            throw new HttpApiError("Unable to fetch album! Status code: " + response.status);

        return await response.json();
    }

    public async getAlbumsById(ids: string[], market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/albums");

        uri.searchParams.append("ids", ids.join(","));
        if (market !== undefined)
            uri.searchParams.append("market", market);

        const response = await fetch(uri, {
            method: "GET",
            headers: BearerRoutes.buildHeaders(this.authMethod.token?.access_token!)
        });

        if (!response.ok)
            throw new HttpApiError("Unable to fetch album! Status code: " + response.status);

        return await response.json();
    }

    public async getAlbumTracksById(options: GetAlbumTracksOptions | string): Promise<any> {
        if(typeof options === "string")
            options = { id: options };

        const uri = new URL("https://api.spotify.com/v1/albums/" + options.id + "/tracks");
        for (const [key, value] of Object.entries(options))
            if(key !== "id") uri.searchParams.append(key, value as string);

        const response = await fetch(uri, {
            method: "GET",
            headers: BearerRoutes.buildHeaders(this.authMethod.token?.access_token!)
        });

        if (!response.ok)
            throw new HttpApiError("Unable to fetch album tracks! Status code: " + response.status);

        return await response.json();
    }

    public async getUsersSavedAlbums(options?: GetUsersSavedAlbumsOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/albums");

        if(options !== undefined)
            for (const [key, value] of Object.entries(options))
                uri.searchParams.append(key, value as string);

        const response = await fetch(uri, {
            method: "GET",
            headers: BearerRoutes.buildHeaders(this.authMethod.token?.access_token!)
        });

        if (!response.ok)
            throw new HttpApiError("Unable to fetch user's saved albums! Status code: " + response.status);

        return await response.json();
    }

    public async getCurrentProfile(): Promise<any> {
        const response: Response = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: BearerRoutes.buildHeaders(this.authMethod.token?.access_token!)
        });

        if (!response.ok)
            throw new HttpApiError("Unable to fetch current user profile! Status code: " + response.status);

        return await response.json();
    }

    public static buildHeaders(token: string): HeadersInit {
        return {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded"
        };
    }

}