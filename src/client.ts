/*
 * The only reason this file is named "client.ts" is because I want it to be above
 * the "index.ts" file in the same directory when sorted alphabetically.
 */

import { AuthenticationMethod, SpotifyToken } from "./authentication/AuthenticationMethod";

export class SpotifyClient {

    private readonly authMethod: AuthenticationMethod;

    constructor(authMethod: AuthenticationMethod) {
        const token: SpotifyToken | undefined = authMethod.token;
        if (token === undefined)
            throw new Error("You must call AuthenticationMethod.authenticate() before creating instantiating!");

        this.authMethod = authMethod;
    }

}