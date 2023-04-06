import {AuthenticationMethod, AuthenticationMethodOptions} from "./AuthenticationMethod";

export abstract class UserVerifiedMethod extends AuthenticationMethod {

    public readonly client_id: string;
    public readonly redirect_uri: URL;

    protected constructor(client_id: string, redirect_uri: URL, options?: AuthenticationMethodOptions) {
        super(options);

        this.client_id = client_id;
        this.redirect_uri = redirect_uri;
    }

    abstract authenticate(): URL;

    abstract verify(data: any): void;

}