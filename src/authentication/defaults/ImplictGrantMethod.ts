import { UserResponseStruct, UserVerifiedMethod, UserVerifiedOptions } from "../UserVerifiedMethod";
import { IntentScopes, SpotifyToken } from "../AuthenticationMethod";

export class ImplictGrantMethod extends UserVerifiedMethod {

    constructor(client_id: string, options: Omit<UserVerifiedOptions, "autoRefresh">) {
        super(client_id, options);
    }

    public authenticate(): URL {
        if (this.token !== undefined)
            throw new Error("Cannot authenticate an already authenticated authentication method!");

        const url: URL = new URL(ImplictGrantMethod.SPOTIFY_AUTH_URL);
        url.searchParams.append("response_type", "token");
        url.searchParams.append("client_id", this.client_id);
        url.searchParams.append("redirect_uri", (this.options as UserVerifiedOptions).redirect_uri.toString());

        if((this.options as UserVerifiedOptions).show_dialog)
            url.searchParams.append("show_dialog", "true")

        const scope: (IntentScopes | string)[] | undefined = this.options.scope;
        if (scope !== undefined && scope.length > 0)
            url.searchParams.append("scope", scope.join(" "));

        return url;
    }

    public verify(data: UserResponseStruct | URL): void {
        if (this.token !== undefined)
            throw new Error("Cannot verify an already verified authentication method!");

        data = ( data instanceof URL
            ? ImplictGrantMethod.parseURL(data)
            : data
        ) as UserResponseStruct;

        const keys: (keyof UserResponseStruct)[] = ["access_token", "expires_in"];
        if(!keys.every(key => key in data))
            throw new TypeError("Invalid UserResponseStruct! (Are you outdated?, this shouldn't happen)");

        this.token = {
            access_token: data["access_token"],
            expires_ms: data["expires_in"] * 1000,
            timestamp_ms: Date.now(),
        } satisfies SpotifyToken;
    }

    public refresh(): void {
        throw new ReferenceError("Implicit Grant Authentication does not support refreshing! (See https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow)");
    }

}