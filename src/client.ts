/*
 * The only reason this file is named "client.ts" is because I want it to be above
 * the "index.ts" file in the same directory when sorted alphabetically.
 */

import { AuthenticationMethod } from "./authentication/AuthenticationMethod";
import { BasicRoutes, BearerRoutes } from "./routes/routes";
import { UserVerifiedMethod } from "./authentication/UserVerifiedMethod";
import { SpotifyError } from "./errors";

export class SpotifyClient<A extends AuthenticationMethod, R extends BasicRoutes> {

    public readonly authMethod: A;
    public readonly routes: R;

    constructor(authMethod: A, routes?: R) {
        if(!authMethod.verified)
            throw new SpotifyError("You must verify the authentication method before creating a client!");

        this.authMethod = authMethod;
        this.routes = routes ?? (authMethod instanceof UserVerifiedMethod
            ? new BearerRoutes(authMethod as any)
            : new BasicRoutes(authMethod)) as unknown as R;
    }

}