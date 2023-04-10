import {
    AuthorizationCodeMethod, ClientCredentialsMethod, ImplictGrantMethod,
    SpotifyClient,
} from "../src";

import { createServer } from "http";
import { launch as openChrome } from "chrome-launcher";
import DoneCallback = jest.DoneCallback;
import { BearerRoutes } from "../src/routes/routes";

const { CLIENT_ID, CLIENT_SECRET } = require("./config/config.json");

test("AuthorizationCodeMethod", (done: DoneCallback) => {
    const method = new AuthorizationCodeMethod(CLIENT_ID, CLIENT_SECRET, {
        redirect_uri: new URL("http://localhost:3000/verify")
    });

    const server = createServer().listen(3000);
    const chrome = openChrome({ startingUrl: method.authenticate().toString() });

    new Promise<void>((resolve, reject) => {
        server.on("request", async (req, res) => {
            if(req.url === "/favicon.ico")
                return;

            const url = new URL(req.url!, "http://localhost:3000");
            await method.verify(url);

            res.end("You may close this window now!");

            server.close();
            (await chrome).kill();

            resolve();
        });
    }).then(async () => {
        const client = new SpotifyClient(method, new BearerRoutes(method));

        try {
            const data: any = await client.routes.getCurrentProfile();
            expect(data).toHaveProperty("display_name");

            done();
        }catch (error: any) {
            fail(error);
        }
    });
}, 60000);

test("ImplictGrantMethod", (done: DoneCallback) => {
    const method = new ImplictGrantMethod(CLIENT_ID, {
        redirect_uri: new URL("http://localhost:3000/verify")
    });

    const server = createServer().listen(3000);
    const chrome = openChrome({ startingUrl: method.authenticate().toString() });

    new Promise<void>((resolve, reject) => {
        server.on("request", async (req, res) => {
            if(req.url === "/favicon.ico")
                return;

            const url = new URL(req.url!, "http://localhost:3000");
            await method.verify(url);

            res.end("You may close this window now!");

            server.close();
            (await chrome).kill();

            resolve();
        });
    }).then(async () => {
        const client = new SpotifyClient(method, new BearerRoutes(method));

        try {
            const data: any = await client.routes.getCurrentProfile();
            expect(data).toHaveProperty("display_name");

            done();
        }catch (error: any) {
            fail(error);
        }
    });
}, 60000)

test("ClientCredentialsMethod",  async () => {
   const method = new ClientCredentialsMethod(CLIENT_ID, CLIENT_SECRET);
   await method.authenticate();

   const client = new SpotifyClient(method);
   const data: any = await client.routes.search({
       q: "505",
       type: ["track"]
   });

   expect(data).toHaveProperty("tracks");
}, 10 * 60000);