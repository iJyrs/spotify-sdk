import { UserResponseStruct, UserVerifiedMethod, UserVerifiedOptions } from "../UserVerifiedMethod";
import { IntentScopes, SpotifyToken } from "../AuthenticationMethod";
import {HttpApiError, SpotifyError} from "../../errors";

export type AuthorizationCodeResponseStruct = {
    code: string,
    state?: string
}

export class AuthorizationCodeMethod extends UserVerifiedMethod {

    private client_secret: string;

    constructor(client_id: string, client_secret: string, options: UserVerifiedOptions) {
        super(client_id, options);

        this.client_secret = client_secret;
    }

    public authenticate(): URL {
        if (this.verified)
            throw new SpotifyError("This instance has already been authenticated!");

        // All we do here is generate a URL for the user to authorize.

        const url: URL = new URL(AuthorizationCodeMethod.SPOTIFY_AUTH_URL);
        url.searchParams.append("response_type", "code");
        url.searchParams.append("client_id", this.client_id);
        url.searchParams.append("redirect_uri", (this.options as UserVerifiedOptions).redirect_uri.toString());

        if((this.options as UserVerifiedOptions).show_dialog)
            url.searchParams.append("show_dialog", "true")

        const scope: (IntentScopes | string)[] | undefined = this.options.scope;
        if (scope !== undefined && scope.length > 0)
            url.searchParams.append("scope", scope.join(" "));

        return url;
    }

    public async verify(data: AuthorizationCodeResponseStruct | URL): Promise<void> {
        if (this.verified)
            throw new SpotifyError("This instance has already been authenticated!");

        data = data instanceof URL ? {
                code: data.searchParams.get("code") as string,
                state: data.searchParams.get("state") || undefined
            } satisfies AuthorizationCodeResponseStruct : data;

        // Check to make sure all keys are inside the struct.
        if(!("code" in data))
            throw new TypeError("Invalid AuthorizationCodeResponseStruct!")

        const redirect_uri: URL | undefined = this.options.redirect_uri;
        if (redirect_uri === undefined)
            throw new TypeError("You must provide a redirect_uri in the options to use this method!");

        const response: Response = await fetch(AuthorizationCodeMethod.SPOTIFY_TOKEN_URL, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(this.client_id + ":" + this.client_secret).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                redirect_uri: (this.options as UserVerifiedOptions).redirect_uri.toString(),
                code: data["code"],
            })
        });

        const json: UserResponseStruct = await response.json();

        if (!response.ok) // Caused by invalid client ID or secret.
            throw new HttpApiError("Unable to authenticate with the Spotify API! (Status code: " + response.status + ")");

        // Check to make sure all required keys are inside the response.
        const keys: (keyof UserResponseStruct)[] = ["access_token", "token_type", "expires_in", "refresh_token"];
        if (!keys.every(key => key in json))
            throw new TypeError("Invalid UserResponseStruct! (Are you outdated?, this shouldn't happen)");

        // Set the token...
        this.token = {
            access_token: json["access_token"],
            refresh_token: json["refresh_token"],
            expires_ms: json["expires_in"] * 1000,
            timestamp_ms: Date.now(),
        } satisfies SpotifyToken;
    }

    public async refresh(): Promise<void> {
        if (!this.verified)
            throw new SpotifyError("You must first authenticate before you can refresh the token!");

        const response: Response = await fetch(AuthorizationCodeMethod.SPOTIFY_TOKEN_URL, {
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

        const data: UserResponseStruct = await response.json();

        if (!response.ok) // Caused by invalid client ID or secret.
            throw new HttpApiError("Unable to refresh the access token! (Status code: " + response.status + " )");

        // Check to make sure all required keys are inside the response.
        const keys: (keyof UserResponseStruct)[] = ["access_token", "token_type", "expires_in", "scope"];
        if (!keys.every(key => key in data))
            throw new TypeError("Invalid AuthorizationCodeTokenResponseStruct! (Are you outdated?, this shouldn't happen)");

        // Refresh the token...
        this.token = {
            access_token: data["access_token"],
            refresh_token: this.token?.refresh_token,
            expires_ms: data["expires_in"] * 1000,
            timestamp_ms: Date.now(),
        } satisfies SpotifyToken;
    }

}