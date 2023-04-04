import {ImplictGrantAuthMethod, IntentScopes, SpotifyClient} from "../src/client";

const { CLIENT_ID, CLIENT_SECRET } = require("../config/config.json");
const { spawn } = require('child_process');

test("AuthenticationMethod#_options", () => {
    const authMethod: ImplictGrantAuthMethod = new ImplictGrantAuthMethod(CLIENT_ID, new URL("http://localhost:3000/verify"), {
        scope: [
            IntentScopes.READ_PRIVATE_PLAYLIST,
            "user-read-private"
        ]
    })

    expect(authMethod.options.scope).toEqual([
        "playlist-read-private",
        "user-read-private"
    ]);
});

test("login", async () => {
    const uri = new URL("");

    const authMethod = new ImplictGrantAuthMethod(CLIENT_ID, new URL("http://localhost:3000/verify"), {
        scope: [
            IntentScopes.READ_PRIVATE_PLAYLIST
        ]
    });

    authMethod.verify(uri);

    const client = new SpotifyClient(authMethod);

    const data: any = await client.routes.me();
    console.log(data);
});