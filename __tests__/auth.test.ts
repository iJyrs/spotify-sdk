import {ImplictGrantMethod, IntentScopes} from "../src";
import {HttpMethods, Routes} from "../src/routes/Routes";

import {createServer} from "http";
import {launch as openChrome} from "chrome-launcher";
import {SearchTransaction} from "../src/routes/Endpoints";

const { CLIENT_ID, CLIENT_SECRET } = require("./config/config.json");

test("Access Token", async () => {
    const method = new ImplictGrantMethod(CLIENT_ID, {
        redirect_uri: new URL("http://localhost:3000/verify"),
        scope: [
            IntentScopes.READ_USER_LIBRARY,
            IntentScopes.MODIFY_USER_LIBRARY,
            IntentScopes.READ_USER_PLAYBACK_STATE,
            IntentScopes.MODIFY_USER_PLAYBACK_STATE
        ]
    });
    const chrome = await openChrome({ startingUrl: method.authenticate().toString() });

    const server = createServer((req, res) => {
        res.end("You may close this window!");

        server.close();
    }).listen(3000);

    await new Promise<void>(resolve => {
        chrome.process.on("exit", () => {
            resolve();
        })
    });
}, 10 * 60000);

test("Merging Objects Test #1", async () => {
    const method = new ImplictGrantMethod(CLIENT_ID, {
        redirect_uri: new URL("http://localhost:3000/verify")
    });

    method.verify(new URL(
        ""
    ));

    const transaction = await Routes.request(method, {
        href: {
            method: HttpMethods.GET,
            uri: "https://api.spotify.com/v1/search",
        },
        options: {
            q: "505",
            type: [ "track" ]
        }
    } satisfies SearchTransaction);
});
