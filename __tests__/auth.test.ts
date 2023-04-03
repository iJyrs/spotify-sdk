import { ClientCredentialsAuthMethod, SpotifyClient } from "../src/client";

const CLIENT_ID = "d14e34bdb9ea498686310bd9606556d1";
const CLIENT_SECRET = "a2f6c90181c04464aaec7238a18835b6";

const authMethod = new ClientCredentialsAuthMethod(CLIENT_ID, CLIENT_SECRET);

test("SpotifyClient#constructor", async () => {
    await authMethod.refresh();

    const client: SpotifyClient = new SpotifyClient(authMethod);
    expect(client).not.toBeUndefined();
});