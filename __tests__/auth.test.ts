import {ImplictGrantMethod, IntentScopes, SpotifyClient} from "../src";
import {createServer} from "http";
import {launch as openChrome} from "chrome-launcher";
import {BearerRoutes} from "../src/routes/BearerRoutes";
import * as fs from "fs";

const { CLIENT_ID, CLIENT_SECRET } = require("./config/config.json");

test("Access Token", async () => {
    const method = new ImplictGrantMethod(CLIENT_ID, {
        redirect_uri: new URL("http://localhost:3000/verify"),
        scope: [ IntentScopes.READ_USER_LIBRARY, IntentScopes.MODIFY_USER_LIBRARY ]
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

test("getCurrentUsersSavedAlbums", async () => {
    const method = new ImplictGrantMethod(CLIENT_ID, { redirect_uri: new URL("http://localhost:3000/verify") });
    method.verify(new URL(
        "" // Paste the URL from the browser here...
    ));

    const client = new SpotifyClient<BearerRoutes>(method);
    const data = await client.routes.getCurrentUsersSavedAlbums();

    expect(data).not.toBeUndefined();

    console.log(data);
    fs.writeFileSync("output.json", JSON.stringify(data, null, 4));
});