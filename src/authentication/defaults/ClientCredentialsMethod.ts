import { AuthenticationMethod, AuthenticationMethodOptions, SpotifyToken } from "../AuthenticationMethod";

type ClientCredentialsResponseStruct = {
    access_token: string,
    expires_in: number
}

export class ClientCredentialsMethod extends AuthenticationMethod {

    public readonly client_id: string;
    public readonly client_secret: string;

    constructor(client_id: string, client_secret: string, options?: Omit<AuthenticationMethodOptions, "scope">) {
        super(options);

        this.client_id = client_id;
        this.client_secret = client_secret;
    }

    public async authenticate(): Promise<ClientCredentialsMethod> {
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

        const data: ClientCredentialsResponseStruct = await response.json();

        if (!("access_token" in data && "expires_in" in data))
            throw new TypeError("Invalid Client Credentials Response! (Maybe you're outdated?)")

        const token: SpotifyToken | undefined = this.token;

        this.token = {
            access_token: data["access_token"],
            expires_ms: data["expires_in"] * 1000,
            timestamp_ms: Date.now(),
        };

        if (token === undefined)
            this.emit("ready");

        return this;
    }

    public refresh(): Promise<void> {
        const promise: any = this.authenticate();
        promise.then(() => this.emit("refresh"));

        return promise;
    }

}