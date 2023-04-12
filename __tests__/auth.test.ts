import {ClientCredentialsMethod, ImplictGrantMethod, SpotifyClient} from "../src";

const { CLIENT_ID, CLIENT_SECRET, igm_url } = require("./config/config.json");

import { createServer } from "http";
import { launch as openChrome } from "chrome-launcher";
import {BasicRoutes} from "../src/routes/BasicRoutes";
import {BearerRoutes} from "../src/routes/BearerRoutes";

type GetAlbumTracksOptions = {
    id: string,
    market?: string,
    limit?: number,
    offset?: number
}

test("ClientCredentialsMethod", async () => {

});