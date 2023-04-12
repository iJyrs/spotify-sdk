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
    const method = new (CLIENT_ID, CLIENT_SECRET, {
        autoRefresh: true
    });

    await method.authenticate();

    const client = new SpotifyClient(method);
})