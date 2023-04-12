import {AuthenticationMethod, AuthenticationMethodOptions} from "../AuthenticationMethod";
import {UserResponseStruct} from "../UserVerifiedMethod";
import {HttpApiError} from "../../errors";

export class ClientCredentialsMethod extends AuthenticationMethod {

    private readonly client_secret: string;

    constructor(client_id: string, client_secret: string, options?: Omit<AuthenticationMethodOptions, "scope" | "redirect_uri">) {
        super(client_id, options);

        this.client_secret = client_secret;
    }

    public async authenticate(): Promise<ClientCredentialsMethod> {
        const response: Response = await fetch(ClientCredentialsMethod.SPOTIFY_TOKEN_URL, {
            method: "POST",
            headers: AuthenticationMethod.buildHeaders(this.client_id, this.client_secret),
            body: new URLSearchParams({
                grant_type: "client_credentials"
            })
        });

        const data: UserResponseStruct = await response.json();

        if (!response.ok) // Caused by invalid client ID or secret.
            throw new HttpApiError("Unable to authenticate with the Spotify API! Status code: " + response.status);

        // Check to make sure all required keys are inside the response.
        const keys: (keyof UserResponseStruct)[] = ["access_token", "token_type", "expires_in"];
        if (!keys.every(key => key in data))
            throw new TypeError("Invalid UserResponseStruct! (Are you outdated?, this shouldn't happen)")

        this.token = {
            access_token: data["access_token"],
            expires_ms: data["expires_in"] * 1000,
            timestamp_ms: Date.now(),
        };

        return this;
    }

    public async refresh(): Promise<void> {
        await this.authenticate();
    }

}