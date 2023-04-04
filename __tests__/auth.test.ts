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
    const uri = new URL("http://localhost:3000/verify#access_token=BQBB_4jgqymAG3U2PVNThiyf9ofOMBGGylOPvQUUSU3jEkVfNPiSoymegcUq0hiNh6CEngyjRoknk_WuEY3vRDAZzh82EVpg9K5UVlPjPx9MQRhQ6r5U04Olm2JIeF-xkeL523pu3RqGcrgGmDPYlE9VxqdzfqSRaBdyFBF0F67s9DWCSb9nUyPfQlvGCa_rGa5F01HpP-L8KprgwCeyyytm&token_type=Bearer&expires_in=3600");

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