import { EventEmitter } from "events";

export class SpotifyClient {

    private authMethod: AuthenticationMethod;

    constructor(authMethod: AuthenticationMethod) {
        let token: SpotifyToken | undefined = authMethod.getToken();
        if(token === undefined)
            throw new Error("You must call AuthenticationMethod.authenticate() before creating instantiating!");

        this.authMethod = authMethod;
    }

    public setAuthenticationMethod(authMethod: AuthenticationMethod): void {
        let token: SpotifyToken | undefined = authMethod.getToken();
        if(token === undefined)
            throw new Error("You must call AuthenticationMethod.authenticate() before creating instantiating!");

        this.authMethod = authMethod;
    }

}

export interface AuthMethodEvents {

    ready: [];
    refresh: [];

}

export interface AuthenticationMethodOptions {

    autoRefresh?: boolean;

}

export interface SpotifyToken {

    token: string;
    expires: number;
    timestamp: number;

}

export abstract class AuthenticationMethod extends EventEmitter {

    protected token: SpotifyToken | undefined;

    protected options: AuthenticationMethodOptions;

    protected constructor(options?: AuthenticationMethodOptions) {
        super();

        this.options = options || {};
        this.refreshOptions(this.options);
    }

    public getOptions(): AuthenticationMethodOptions {
        return this.options;
    }

    public setOptions(options: AuthenticationMethodOptions): void {
        this.options = options;

        this.refreshOptions(this.options);
    }

    private refreshOptions(options: AuthenticationMethodOptions): void {
        if(options.autoRefresh) {
            // TODO: Implement auto-refresh
        }
    }

    public getToken(): SpotifyToken | undefined {
        return this.token;
    }

    abstract authenticate(): Promise<string | undefined>;

    abstract refresh(): Promise<void>;

    public emit<E extends keyof AuthMethodEvents>(eventName: E, ...args: AuthMethodEvents[E]): boolean {
        return super.emit(eventName, args);
    }

    public on<E extends keyof AuthMethodEvents>(eventName: E, listener: (...args: AuthMethodEvents[E]) => void): this {
        // @ts-ignore
        return super.on(eventName, listener);
    }

    public once<E extends keyof AuthMethodEvents>(eventName: E, listener: (...args: AuthMethodEvents[E]) => void): this {
        // @ts-ignore
        return super.once(eventName, listener);
    }

    public off<E extends keyof AuthMethodEvents>(eventName: E, listener: (...args: AuthMethodEvents[E]) => void): this {
        // @ts-ignore
        return super.off(eventName, listener);
    }

    public removeListener<E extends keyof AuthMethodEvents>(eventName: E, listener: (...args: AuthMethodEvents[E]) => void): this {
        // @ts-ignore
        return super.removeListener(eventName, listener);
    }

    public removeAllListeners<E extends keyof AuthMethodEvents>(event?: E): this {
        return super.removeAllListeners(event);
    }

}

export class ClientCredentialsAuthMethod extends AuthenticationMethod {

    public readonly client_id: string;
    public readonly client_secret: string;

    constructor(client_id: string, client_secret: string, options?: AuthenticationMethodOptions) {
        super(options);

        this.client_id = client_id;
        this.client_secret = client_secret;
    }

    public async authenticate(): Promise<string | undefined> {
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

        const json: any = await response.json();
        const promise = Promise.resolve(undefined);

        promise.then(() => {
            this.token = {
                token: json["access_token"],
                expires: json["expires_in"],
                timestamp: Date.now(),
            };
        });

        return promise;
    }

    public refresh(): Promise<void> {
        const promise: any = this.authenticate();
        promise.then(() => this.emit("refresh"));

        return promise;
    }

}
