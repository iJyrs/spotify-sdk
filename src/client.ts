/*
 * The only reason this file is named "client.ts" is because I want it to be above
 * the "index.ts" file in the same directory when sorted alphabetically.
 */

import { AuthenticationMethod } from "./authentication/AuthenticationMethod";
import { SpotifyError } from "./errors";
import { EventEmitter } from "events";

export class SpotifyClient extends EventEmitter {

    protected readonly authMethod: AuthenticationMethod;

    constructor(authMethod: AuthenticationMethod) {
        super();

        if(!authMethod.verified)
            throw new SpotifyError("You must verify the authentication method before creating a client!");

        this.authMethod = authMethod;
    }

}
