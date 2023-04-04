import { ImplictGrantAuthMethod, SpotifyClient } from "../src/client";
import { createInterface } from "readline";
import DoneCallback = jest.DoneCallback;

const CLIENT_ID = "d14e34bdb9ea498686310bd9606556d1";
const CLIENT_SECRET = "a2f6c90181c04464aaec7238a18835b6";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

test.concurrent("SpotifyClient#constructor", async () => {
    const authMethod = new ImplictGrantAuthMethod(CLIENT_ID, "https://meturum.com");
    const url: string = authMethod.authenticate();

    console.log("Open this URL in your browser: " + url);

    const str = await new Promise<string>((resolve) => {
        readline.question("", (input: string) => {
            resolve(input);
        });
    });

    const response: URL = new URL(str);

    authMethod.verify({
        access_token: response.searchParams.get("access_token") as string,
        token_type: response.searchParams.get("token_type") as string,
        expires_in: parseInt((response.searchParams.get("expires_in") as string)),
        state: (response.searchParams.get("state") as string | undefined)
    });

    const client: SpotifyClient = new SpotifyClient(authMethod);
    const data: any = await client.routes.me();

    expect(data).not.toBeUndefined();
    console.table(data);

    readline.close();
}, 60000);
