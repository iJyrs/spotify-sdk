import { UserVerifiedMethod } from "../UserVerifiedMethod";
import { AuthenticationMethodOptions, IntentScopes, SpotifyToken } from "../AuthenticationMethod";

type ImplicitGrantResponseStruct = {
    access_token: string;
    token_type: string;
    expires_in: number;
    state?: string | undefined;
}

export class ImplictGrantMethod extends UserVerifiedMethod {

    constructor(client_id: string, redirect_uri: URL, options?: Omit<AuthenticationMethodOptions, "autoRefresh">) {
        super(client_id, redirect_uri, options);
    }

    public authenticate(): URL {
        if (this.token !== undefined)
            throw new Error("Cannot authenticate an already authenticated authentication method!");

        const url: URL = new URL("https://accounts.spotify.com/authorize");
        url.searchParams.append("response_type", "token");
        url.searchParams.append("client_id", this.client_id);
        url.searchParams.append("redirect_uri", this.redirect_uri.toString());

        const scope: (IntentScopes | string)[] | undefined = this.options.scope;
        if (scope !== undefined && scope.length > 0)
            url.searchParams.append("scope", scope.join(" "));

        return url;
    }

    public verify(data: ImplicitGrantResponseStruct | URL): void {
        if (this.token !== undefined)
            throw new Error("Cannot verify an already verified authentication method!");

        const parseURL = (url: URL): ImplicitGrantResponseStruct => {
            if (url.searchParams.has("error"))
                throw new Error("Unable to authenticate with the Spotify API! Error: " + url.searchParams.get("error"));

            return url.hash.split('&').reduce((prev: any, param) => {
                const [key, value] = param.split('=');
                prev[key] = value;

                return prev;
            }, {} as ImplicitGrantResponseStruct);
        }

        data = data instanceof URL ? parseURL(data) : data;

        // Verify that the object contains all required elements.
        if (!("access_token" in data && "token_type" in data && "expires_in" in data))
            throw new TypeError("Invalid Implicit Grant Response!");

        const token: SpotifyToken | undefined = this.token;

        this.token = {
            access_token: data.access_token,
            expires_ms: data.expires_in * 1000,
            timestamp_ms: Date.now(),
        };

        if (token === undefined)
            this.emit("ready");
    }

    public refresh(): void {
        throw new ReferenceError("Implicit Grant Authentication does not support refreshing! (See https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow)");
    }

}