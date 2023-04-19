import {AuthenticationMethod, SpotifyToken} from "../authentication/AuthenticationMethod";
import { HttpApiError } from "../errors";

type HttpMethods = "GET" | "POST" | "PUT" | "DELETE";

type RouteOptions = {
    readonly id?: string,
    readonly category_id?: string,
    readonly q?: string,
    readonly type?: string[],
    readonly market?: string,
    readonly country?: string,
    readonly locale?: string,
    readonly limit?: number,
    readonly offset?: number,
    readonly include_external?: string,
    readonly include_groups?: string,
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

type GetArtistsAlbumsOptions = Pick<RouteOptions, "id" | "include_groups" | "market" | "limit" | "offset"> & {
    readonly id: string
}

type GetUsersSavedAudiobooksOptions = Pick<RouteOptions, "limit" | "offset">;

type GetSeveralBrowseCategoriesOptions = Pick<RouteOptions, "country" | "locale" | "limit" | "offset">;

type GetSingleBrowseCategoryOptions = Pick<RouteOptions, "category_id" | "country" | "locale">;

type GetUsersSavedEpisodesOptions = Pick<RouteOptions, "market" | "limit" | "offset">;

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
        BearerRoutes.importOptions(uri, options);

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

    public async getArtist(id: string): Promise<any> {
        return await BearerRoutes.makeRequest("https://api.spotify.com/v1/artists/" + id, this.authMethod, { method: "GET" });
    }

    public async getSeveralArtists(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/artists");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getArtistsAlbums(options: GetArtistsAlbumsOptions | string): Promise<any> {
        if(typeof options === "string")
            options = { id: options } satisfies GetArtistsAlbumsOptions;

        const uri = new URL("https://api.spotify.com/v1/artists/" + options.id + "/albums");
        BearerRoutes.importOptions(uri, options);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getArtistsTopTracks(id: string, market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/artists/" + id + "/top-tracks");

        if(market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getArtistsRelatedArtists(id: string): Promise<any> {
        return await BearerRoutes.makeRequest("https://api.spotify.com/v1/artists/" + id + "/related-artists", this.authMethod, { method: "GET" });
    }

    public async getAudiobook(id: string, market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/audiobooks/" + id);

        if(market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getSeveralAudiobooks(ids: string[], market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/audiobooks");

        uri.searchParams.append("ids", ids.join(","));
        if(market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getAudiobookChapters(id: string, market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/audiobooks/" + id + "/chapters");

        if(market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getCurrentUsersSavedAudiobooks(options?: GetUsersSavedAudiobooksOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/audiobooks");

        if(options !== undefined)
            BearerRoutes.importOptions(uri, options);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async saveAudiobooksForCurrentUser(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/audiobooks");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "PUT" });
    }

    public async removeCurrentUsersSavedAudiobooks(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/audiobooks");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "DELETE" });
    }

    public async checkCurrentUsersSavedAudiobooks(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/audiobooks/contains");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getSeveralBrowseCategories(options?: GetSeveralBrowseCategoriesOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/browse/categories");

        if(options !== undefined)
            BearerRoutes.importOptions(uri, options);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getSingleBrowseCategory(options: GetSingleBrowseCategoryOptions | string): Promise<any> {
        if(typeof options === "string")
            options = { category_id: options } satisfies GetSingleBrowseCategoryOptions;

        const uri = new URL("https://api.spotify.com/v1/browse/categories/" + options.category_id);
        BearerRoutes.importOptions(uri, options);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getChapter(id: string, market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/chapters/" + id);

        if(market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getSeveralChapters(ids: string[], market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/chapters");

        uri.searchParams.append("ids", ids.join(","));
        if(market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getEpisode(id: string, market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/episodes/" + id);

        if(market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getSeveralEpisodes(ids: string[], market?: string): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/episodes");

        uri.searchParams.append("ids", ids.join(","));
        if(market !== undefined)
            uri.searchParams.append("market", market);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getCurrentUsersSavedEpisodes(options?: GetUsersSavedEpisodesOptions): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/episodes");

        if(options !== undefined)
            BearerRoutes.importOptions(uri, options);

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async saveEpisodesForCurrentUser(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/episodes");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "PUT" });
    }

    public async removeCurrentUsersSavedEpisodes(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/episodes");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "DELETE" });
    }

    public async checkCurrentUsersSavedEpisodes(ids: string[]): Promise<any> {
        const uri = new URL("https://api.spotify.com/v1/me/episodes/contains");
        uri.searchParams.append("ids", ids.join(","));

        return await BearerRoutes.makeRequest(uri, this.authMethod, { method: "GET" });
    }

    public async getAvailableGenreSeeds(): Promise<any> {
        return await BearerRoutes.makeRequest("https://api.spotify.com/v1/recommendations/available-genre-seeds", this.authMethod, { method: "GET" });
    }

    public async getAvailableMarkets(): Promise<any> {
        return await BearerRoutes.makeRequest("https://api.spotify.com/v1/markets", this.authMethod, { method: "GET" });
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