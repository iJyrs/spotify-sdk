import { EventEmitter } from "events";

export interface SpotifyToken {

    readonly access_token: string;
    readonly refresh_token?: string;
    readonly expires_ms: number;
    readonly timestamp_ms: number;

}

export enum IntentScopes {

    READ_PRIVATE_PLAYLIST = "playlist-read-private"

}

export type AuthenticationMethodOptions = {
    autoRefresh?: boolean;
    redirect_uri?: URL;
    scope?: (IntentScopes | string)[];
}

type AuthMethodEvents = {
    ready: [];
    refresh: [];
}

export abstract class AuthenticationMethod extends EventEmitter {

    public static readonly SPOTIFY_AUTH_URL: string = "https://accounts.spotify.com/authorize";
    public static readonly SPOTIFY_TOKEN_URL: string = "https://accounts.spotify.com/api/token";

    protected client_id: string;
    private _options: AuthenticationMethodOptions;
    private _token?: SpotifyToken;

    protected constructor(client_id: string, options: AuthenticationMethodOptions = {}) {
        super();

        this.client_id = client_id;
        this._options = options;
        this.refreshOptions(this._options);
    }

    public get options(): AuthenticationMethodOptions {
        return this._options;
    }

    public set options(value: AuthenticationMethodOptions) {
        this._options = value;

        this.refreshOptions(value);
    }

    private refreshOptions(options: AuthenticationMethodOptions): void {
        const apply_auto_refresh = (autoRefresh: boolean = false): void => {
            if (!autoRefresh)
                return;

            const token: SpotifyToken | undefined = this.token;
            if (token === undefined) {
                this.once("ready", () => apply_auto_refresh(true));

                return;
            }

            const timeLeft: number = Date.now() - token.timestamp_ms;
            if (timeLeft >= 0) {
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

    get token(): SpotifyToken | undefined {
        return this._token;
    }

    protected set token(value: SpotifyToken | undefined) {
        const prev = this.token;
        this._token = value;

        if (prev === undefined) this.emit("ready")
        else this.emit("refresh");
    }

    get verified(): boolean {
        return this.token !== undefined;
    }

    abstract authenticate(): any;

    abstract refresh(): void;

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