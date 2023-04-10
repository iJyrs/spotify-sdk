const { CLIENT_ID, CLIENT_SECRET } = require("./config/config.json");

import {
    AuthorizationCodeMethod, ClientCredentialsMethod, ImplictGrantMethod,
    SpotifyClient,
} from "../src";
import { createServer } from "http";
import { launch as openChrome } from "chrome-launcher";
import { BearerRoutes } from "../src/routes/routes";
import * as readline from 'readline';

const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

test("AuthorizationCodeMethod", async () => {
    const method = new AuthorizationCodeMethod(CLIENT_ID, CLIENT_SECRET, {
        redirect_uri: new URL("http://localhost:3000/verify")
    });

    const server = createServer().listen(3000);
    const chrome = openChrome({ startingUrl: method.authenticate().toString() });

    await new Promise<void>((resolve, reject) => {
        server.on("request", (req, res) => {
            if(req.url === "/favicon.ico")
                return;

            method.verify(new URL(req.url!, "http://localhost:3000"));

            chrome.then((chrome) => chrome.kill());
            server.close();

            resolve();
        });
    });

    const client = new SpotifyClient(method, new BearerRoutes(method));
    const data = await client.routes.getCurrentProfile();

    expect(data).toHaveProperty("display_name");
}, 1000);

test("ImplictGrantMethod Part #1", async () => {
    const method = new ImplictGrantMethod(CLIENT_ID, {
        redirect_uri: new URL("http://localhost:3000/verify")
    });

    const server = createServer().listen(3000);
    const chrome = openChrome({ startingUrl: method.authenticate().toString() });

    await new Promise<void>((resolve, reject) => {
        server.on("request", (req, res) => {
            if(req.url === "/favicon.ico")
                return;

            res.end("Please copy the URL into ImplictGrantMethod Part #2, then you may close this window.");

            server.close();
            resolve();
        });
    });

    (await chrome).kill();
}, 60000);

test("ImplictGrantMethod Part #2", async () => {
    const method = new ImplictGrantMethod(CLIENT_ID, {
        redirect_uri: new URL("http://localhost:3000")
    });

    // Paste URL here:
    method.verify(new URL(""));

    const client = new SpotifyClient(method, new BearerRoutes(method));
    const data = await client.routes.getCurrentProfile();

    expect(data).toHaveProperty("display_name");
});

test("ClientCredentialsMethod",  async () => {
   const method = new ClientCredentialsMethod(CLIENT_ID, CLIENT_SECRET);
   await method.authenticate();

   const client = new SpotifyClient(method);
   const data: any = await client.routes.search({
       q: "505",
       type: ["track"]
   });

   expect(data).toHaveProperty("tracks");
});