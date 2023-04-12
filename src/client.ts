/*
 * The only reason this file is named "client.ts" is because I want it to be above
 * the "index.ts" file in the same directory when sorted alphabetically.
 */

import { AuthenticationMethod } from "./authentication/AuthenticationMethod";
import { BasicRoutes } from "./routes/BasicRoutes";
import { SpotifyError } from "./errors";
import { BearerRoutes } from "./routes/BearerRoutes";

export class SpotifyClient<R extends BasicRoutes> {

    protected readonly authMethod: AuthenticationMethod;
    public readonly routes: R;

    constructor(authMethod: AuthenticationMethod) {
        if(!authMethod.verified)
            throw new SpotifyError("You must verify the authentication method before creating a client!");

        this.authMethod = authMethod;
        this.routes = new BearerRoutes(authMethod) as unknown as R;
    }

}