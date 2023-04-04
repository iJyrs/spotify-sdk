import { EventEmitter } from "events";
import { SpotifyRoutes } from "./routes";

export class SpotifyClient {

    private readonly authMethod: AuthenticationMethod;

    public readonly routes: SpotifyRoutes;

    constructor(authMethod: AuthenticationMethod) {
        const token: SpotifyToken | undefined = authMethod.getToken();
        if(token === undefined)
            throw new Error("You must call AuthenticationMethod.authenticate() before creating instantiating!");

        this.authMethod = authMethod;
        this.routes = new SpotifyRoutes(authMethod);
    }

}

export interface AuthMethodEvents {

    ready: [];
    refresh: [];

}

export enum IntentScopes {

    READ_PRIVATE_PLAYLIST = "playlist-read-private"

}

export interface AuthenticationMethodOptions {

    autoRefresh?: boolean;

    // TODO: Write an enum for this.
    scope?: (IntentScopes | string)[];

}

export interface SpotifyToken {

    token: string;
    expires_ms: number;
    timestamp_ms: number;

}

export abstract class AuthenticationMethod extends EventEmitter {

    private _options: AuthenticationMethodOptions;

    protected token: SpotifyToken | undefined;

    protected constructor(options?: AuthenticationMethodOptions) {
        super();

        this._options = options || {};
        this.refreshOptions(this._options);
    }


    get options(): AuthenticationMethodOptions {
        return this._options;
    }

    set options(value: AuthenticationMethodOptions) {
        this._options = value;

        this.refreshOptions(value);
    }

    private refreshOptions(options: AuthenticationMethodOptions): void {
        const apply_auto_refresh = (autoRefresh: boolean = false): void => {
            if(!autoRefresh)
                return;

            const token: SpotifyToken | undefined = this.token;
            if(token === undefined) {
                this.once("ready", () => apply_auto_refresh(true));

                return;
            }

            const timeLeft: number = Date.now() - token.timestamp_ms;
            if(timeLeft >= 0) {
                this.once("refresh", () => apply_auto_refresh(true));
                this.refresh();

                return;
            }

            setTimeout(() => {
                this.refresh();
            }, timeLeft - 5000); // Refresh 5 seconds before the token expires. (HTTP Latency)
        }

        apply_auto_refresh(options.autoRefresh);
    }

    public getToken(): SpotifyToken | undefined {
        return this.token;
    }

    abstract authenticate(): any;

    abstract refresh(): any;

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

export interface UserVerifiedAuthMethod {

    verify(data: any): void;

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
            if(this.token === undefined)
                this.emit("ready");

            this.token = {
                token: json["access_token"],
                expires_ms: json["expires_in"] * 1000,
                timestamp_ms: Date.now(),
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

export interface ImplicitGrantResponseStruct {

    access_token: string;
    token_type: string;
    expires_in: number;
    state?: string | undefined;

}

export class ImplictGrantAuthMethod extends AuthenticationMethod implements UserVerifiedAuthMethod {

    public readonly client_id: string;
    public readonly redirect_uri: URL;

    constructor(client_id: string, redirect_uri: URL, options?: Omit<AuthenticationMethodOptions, "autoRefresh">) {
        super(options);

        this.client_id = client_id;
        this.redirect_uri = redirect_uri;
    }

    public authenticate(): URL {
        const url: URL = new URL("https://accounts.spotify.com/authorize");
        url.searchParams.append("response_type", "token");
        url.searchParams.append("client_id", this.client_id);
        url.searchParams.append("redirect_uri", this.redirect_uri.toString());

        const scope: (IntentScopes | string)[] | undefined = this.options.scope;
        if(scope !== undefined && scope.length > 0)
            url.searchParams.append("scope", scope.join(" "));

        return url;
    }

    public verify(_data_: ImplicitGrantResponseStruct | URL): void {
        let data: ImplicitGrantResponseStruct;

        if(_data_ instanceof URL) {
            if(_data_.searchParams.has("error"))
                throw new Error("Unable to authenticate with the Spotify API! Error: " + _data_.searchParams.get("error") || "Unknown");

            data = _data_.hash.split('&').reduce((prev: any, param: string, index: number) => {
                if(index === 0) param = param.substring(1);

                const [key, value] = param.split('=');
                prev[key] = value;

                return prev;
            }, {} as ImplicitGrantResponseStruct);
        }else data = _data_;

        // Verify that the object contains all required elements.
        if(!("access_token" in data && "token_type" in data && "expires_in" in data))
            throw new TypeError("Invalid Implicit Grant Response!");

        const token: SpotifyToken | undefined = this.token;

        this.token = {
            token: data.access_token,
            expires_ms: data.expires_in * 1000,
            timestamp_ms: Date.now(),
        };

        if(token === undefined)
            this.emit("ready");
    }

    public refresh(): Promise<void> {
        return Promise.reject("Implicit Grant Authentication does not support refreshing! (See https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow)");
    }

}
