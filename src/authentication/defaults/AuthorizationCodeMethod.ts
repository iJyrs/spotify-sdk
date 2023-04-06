import { UserVerifiedMethod } from "../UserVerifiedMethod";
import { AuthenticationMethodOptions, IntentScopes, SpotifyToken } from "../AuthenticationMethod";

type AuthorizationCodeResponseStruct = {
    code: string,
    state: string
}

type AuthorizationCodeTokenResponseStruct = {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

export class AuthorizationCodeMethod extends UserVerifiedMethod {

    private client_secret: string;

    constructor(client_id: string, client_secret: string, redirect_uri: URL, options?: AuthenticationMethodOptions) {
        super(client_id, redirect_uri, options);

        this.client_secret = client_secret;
    }

    public authenticate(): URL {
        if (this.token !== undefined)
            throw new Error("Cannot authenticate an already authenticated authentication method!");

        const url: URL = new URL("https://accounts.spotify.com/authorize");
        url.searchParams.append("response_type", "code");
        url.searchParams.append("client_id", this.client_id);
        url.searchParams.append("redirect_uri", this.redirect_uri.toString());

        const scope: (IntentScopes | string)[] | undefined = this.options.scope;
        if (scope !== undefined && scope.length > 0)
            url.searchParams.append("scope", scope.join(" "));

        return url;
    }

    public async verify(data: AuthorizationCodeResponseStruct): Promise<void> {
        if (this.token !== undefined)
            return Promise.reject("Cannot verify an already verified authentication method!");

        const response: Response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(this.client_id + ":" + this.client_secret).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                code: data.code,
                redirect_uri: this.redirect_uri.toString(),
                grant_type: "authorization_code"
            })
        });

        if (!response.ok) // Caused by invalid client ID or secret.
            return Promise.reject("Unable to authenticate with the Spotify API! Status code: " + response.status);

        const json: AuthorizationCodeTokenResponseStruct = await response.json();

        if (!("access_token" in json && "token_type" in json && "expires_in" in json && "refresh_token" in json && "scope" in json))
            throw new Error("Invalid AuthorizationCodeTokenResponseStruct! (Are you outdated?, this shouldn't happen)");

        const token: SpotifyToken | undefined = this.token;

        this.token = {
            access_token: json["access_token"],
            refresh_token: json["refresh_token"],
            expires_ms: json["expires_in"] * 1000,
            timestamp_ms: Date.now(),
        };

        if (token === undefined)
            this.emit("ready");
    }

    public async refresh(): Promise<void> {
        if (this.token === undefined)
            throw new Error("You must first authenticate before you can refresh the token!");

        const response: Response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(this.client_id + ":" + this.client_secret).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: this.token?.refresh_token as string
            })
        });

        if (!response.ok) // Caused by invalid client ID or secret.
            return Promise.reject("Unable to refresh the access token! (API Status code: " + response.status + " )");

        const data: AuthorizationCodeTokenResponseStruct = await response.json();
        if (!("access_token" in data && "token_type" in data && "expires_in" in data && "scope" in data))
            throw new Error("Invalid AuthorizationCodeTokenResponseStruct! (Are you outdated?, this shouldn't happen)");

        this.token = {
            access_token: data["access_token"],
            expires_ms: data["expires_in"] * 1000,
            timestamp_ms: Date.now(),
        };

        this.emit("refresh");
    }

}