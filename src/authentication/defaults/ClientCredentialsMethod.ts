import { AuthenticationMethod, AuthenticationMethodOptions } from "../AuthenticationMethod";
import { UserResponseStruct } from "../UserVerifiedMethod";

export class ClientCredentialsMethod extends AuthenticationMethod {

    private readonly client_secret: string;

    constructor(client_id: string, client_secret: string, options?: Omit<AuthenticationMethodOptions, "scope" | "redirect_uri">) {
        super(client_id, options);

        this.client_secret = client_secret;
    }

    public async authenticate(): Promise<void> {
        const basic_token: string = Buffer.from(this.client_id + ":" + this.client_secret).toString("base64");

        const response: Response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + basic_token,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials"
            })
        });

        if (!response.ok) // Caused by invalid client ID or secret.
            return Promise.reject("Unable to authenticate with the Spotify API! Status code: " + response.status);

        const data: UserResponseStruct = await response.json();
        const keys: (keyof UserResponseStruct)[] = ["access_token", "token_type", "expires_in"];
        if (!keys.every(key => key in data))
            throw new TypeError("Invalid UserResponseStruct! (Are you outdated?, this shouldn't happen)")

        this.token = {
            access_token: data["access_token"],
            expires_ms: data["expires_in"] * 1000,
            timestamp_ms: Date.now(),
        };
    }

    public refresh(): Promise<void> {
        const promise: any = this.authenticate();
        promise.then(() => this.emit("refresh"));

        return promise;
    }

}