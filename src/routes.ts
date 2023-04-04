import {AuthenticationMethod, ClientCredentialsAuthMethod} from "./client";
import {UnsupportedOperationError} from "./utils/errors";

export interface APIRoutes {

    me(): Promise<any>;

}

export class SpotifyRoutes implements APIRoutes {

    public static readonly BASE_URL: string = "https://api.spotify.com/v1/";

    private readonly authMethod: AuthenticationMethod;

    constructor(authMethod: AuthenticationMethod) {
        this.authMethod = authMethod;
    }

    public async me(): Promise<any> {
        const authMethod: AuthenticationMethod = this.authMethod;

        if(authMethod instanceof ClientCredentialsAuthMethod)
            throw new UnsupportedOperationError("ClientCredentialsAuthMethod does not support this operation.");

        const response: Response = await fetch(SpotifyRoutes.BASE_URL + "me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.authMethod.getToken()?.token
            }
        });

        return await response.json();
    }

}