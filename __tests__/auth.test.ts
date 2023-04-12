import {BearerRoutes} from "../src/routes/BearerRoutes";

const { CLIENT_ID, CLIENT_SECRET } = require("./config/config.json");

import {
    AuthorizationCodeMethod, ClientCredentialsMethod, ImplictGrantMethod,
    SpotifyClient,
} from "../src";
import { createServer } from "http";
import { launch as openChrome } from "chrome-launcher";
import {BasicRoutes} from "../src/routes/BasicRoutes";

test("ClientCredentialsMethod", async () => {
    const method = await new ClientCredentialsMethod(CLIENT_ID, CLIENT_SECRET, {
        autoRefresh: true
    }).authenticate();

    const client = new SpotifyClient<BasicRoutes>(method);

    // Response will have types in the future...
    const data: any = await client.routes.search({
        q: "Me and Your Mama",
        type: ["track"]
    });
})