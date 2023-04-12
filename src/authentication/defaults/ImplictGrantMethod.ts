import { UserResponseStruct, UserVerifiedMethod, UserVerifiedOptions } from "../UserVerifiedMethod";
import { IntentScopes, SpotifyToken } from "../AuthenticationMethod";
import { SpotifyError, UnsupportedOperationError } from "../../errors";

export class ImplictGrantMethod extends UserVerifiedMethod {

    constructor(client_id: string, options: Omit<UserVerifiedOptions, "autoRefresh">) {
        super(client_id, options);
    }

    public authenticate(): URL {
        if (this.verified)
            throw new SpotifyError("This instance has already been authenticated!");

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
        if (this.verified)
            throw new SpotifyError("This instance has already been authenticated!");

        data = ( data instanceof URL
            ? UserVerifiedMethod.parseURL(data)
            : data
        ) as UserResponseStruct;

        // Check to make sure all required keys are inside the response.
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
        throw new UnsupportedOperationError("Implicit Grant Authentication does not support refreshing! (See https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow)");
    }

}