import {AuthenticationMethod, SpotifyToken} from "../authentication/AuthenticationMethod";
import { HttpApiError } from "../errors";

type HttpMethods = "GET" | "POST" | "PUT" | "DELETE";

type RouteOptions = {
    readonly id?: string,
    readonly q?: string,
    readonly type?: string[],
    readonly market?: string,
    readonly country?: string,
    readonly limit?: number,
    readonly offset?: number,
    readonly include_external?: string
};

type SearchOptions = Pick<RouteOptions, "q" | "type" | "market" | "limit" | "offset" | "include_external"> & {
  readonly q: string,
  readonly type: ("album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook")[]
};

type GetAlbumTracksOptions = Pick<RouteOptions, "id" | "market" | "limit" | "offset"> & {
    readonly id: string
};

type GetUsersSavedAlbumsOptions = Pick<RouteOptions, "limit" | "offset" | "market">;

type GetNewReleasesOptions = Pick<RouteOptions, "country" | "limit" | "offset">;

export class BearerRoutes {

    protected readonly authMethod: AuthenticationMethod;

    constructor(authMethod: AuthenticationMethod) {
        this.authMethod = authMethod;
    }

    public async search(options: SearchOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/search");
        BearerRoutes.importOptions(uri, options);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getAlbumById(id: string, market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/albums/" + id);

        if (market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getAlbumsById(ids: string[], market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/albums");

        uri.searchParams.append("ids", ids.join(","));
        if (market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getAlbumTracksById(options: GetAlbumTracksOptions | string): Promise<any> {
        if(typeof options === "string")
            options = { id: options };

        const uri = new URL("https://api.spotify.com/v1/albums/" + options.id + "/tracks");
        for (const [key, value] of Object.entries(options))
            if(key !== "id") uri.searchParams.append(key, value as string);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getCurrentUsersSavedAlbums(options?: GetUsersSavedAlbumsOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/albums");

        if(options !== undefined)
            BearerRoutes.importOptions(uri, options);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async saveAlbumsForCurrentUser(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/albums");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async removeCurrentUsersSavedAlbums(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/albums");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "DELETE" });
    }

    public async checkCurrentUserSavedAlbums(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/albums/contains");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getNewReleases(options?: GetNewReleasesOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/browse/new-releases");

        if(options !== undefined)
            BearerRoutes.importOptions(uri, options);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getCurrentProfile(): Promise<any> {
        return await BearerRoutes.makeRequest("https://api.spotify.com/v1/me", this.authMethod, { method: "GET" })
    }

    protected static importOptions(uri: URL, options: Object): void {
        for (const [key, value] of Object.entries(options))
            uri.searchParams.append(key, value as string);
    }

    protected static buildHeaders(token: string): HeadersInit {
        return {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/x-www-form-urlencoded"
        };
    }

    protected static async makeRequest(url: string | URL, authMethod: AuthenticationMethod, o_init?: Omit<RequestInit, "headers"> | HttpMethods): Promise<any> {
        const token: SpotifyToken | undefined = authMethod.token;
        if (token === undefined)
            throw new Error("Unable to make request! Authentication method is unverified!");

        if(typeof o_init === "string")
            o_init = { method: o_init } satisfies RequestInit;

        const init: RequestInit = o_init as RequestInit;
        init.headers = BearerRoutes.buildHeaders(token.access_token);

        const response = await fetch(url, init);

        if (!response.ok)
            throw new HttpApiError("Unable to fetch data! Status code: " + response.status);

        return await response.json();
    }


}