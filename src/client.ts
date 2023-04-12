/*
 * The only reason this file is named "client.ts" is because I want it to be above
 * the "index.ts" file in the same directory when sorted alphabetically.
 */

import { AuthenticationMethod } from "./authentication/AuthenticationMethod";
import { BasicRoutes } from "./routes/BasicRoutes";
import { SpotifyError } from "./errors";
import { BearerRoutes } from "./routes/BearerRoutes";

export class SpotifyClient<R extends BasicRoutes> {

    protected authMethod: AuthenticationMethod;
    public readonly routes: R;

    constructor(authMethod: AuthenticationMethod) {
        if(!authMethod.verified)
            throw new SpotifyError("You must verify the authentication method before creating a client!");

        this.authMethod = authMethod;
        this.routes = new BearerRoutes(authMethod) as unknown as R;
    }

    public setAuthMethod(authMethod: AuthenticationMethod) {
        if(!authMethod.verified)
            throw new SpotifyError("Could not update client authentication method! You must verify the new method, first!");

        this.authMethod = authMethod;
    }

}