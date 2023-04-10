import { AuthenticationMethod, AuthenticationMethodOptions, IntentScopes } from "./AuthenticationMethod";

export type UserResponseStruct = {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in: number;
    state?: string | undefined;
    scope?: (IntentScopes | string)[];
}

export type UserVerifiedOptions = {
    redirect_uri: URL
    show_dialog?: boolean;
} & AuthenticationMethodOptions;

export abstract class UserVerifiedMethod extends AuthenticationMethod {

    protected constructor(client_id: string, options: UserVerifiedOptions) {
        super(client_id, options);
    }

    abstract authenticate(): URL;

    abstract verify(data: any): void;

    public static parseURL(url: URL): any {
        const obj: {[key: string]: any} = {};
        const array = url.hash.substring(1).split('&');

        for(let i = 0; i < array.length; i++) {
            const [key, value] = array[i].split('=');
            obj[key] = decodeURIComponent(value);
        }

        return obj;
    }

}