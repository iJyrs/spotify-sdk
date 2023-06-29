# spotify-webapi (WIP)
[![Version](https://img.shields.io/npm/v/@ijyrs/spotify-webapi.svg)](https://www.npmjs.com/package/@ijyrs/spotify-webapi)
[![License](https://img.shields.io/npm/l/@ijyrs/spotify-webapi)]()
[![Package Size MZ](https://img.shields.io/bundlephobia/minzip/@ijyrs/spotify-webapi)]()
---

An open-source, unofficial SDK package for developers looking to integrate the Spotify Web API with their Node.js applications.

### 📝 Package Direction / Disclaimers

The objective of developing this package is to create a user-friendly sdk for the Spotify Web API. Therefore, the focus of the development is not on **minimizing the package's size** or **ensuring compatibility with all browsers**.

⚠️ This project is still under heavy development! Use at your own risk. ⚠️

*There are going to be missing features & bugs,* please open an [Issue]() and I will get to it eventually.

# 💾 Installation / Prerequisites

You can install the package via `npm install @ijyrs/spotify-webapi`.

To access Spotify's Web API, you must create a application, you can find the link [here]().

# 🎫 Documentation

*Coming soon.* **Should** be available once the library reaches v1.0.0 or when mostly completed.

### Quick Example:

For this example, we will be using the `ClientCredentialsMethod` to authenticate with Spotify's WebAPI.

```typescript
import { ClientCredentialsMethod, SearchTransaction } from "@ijyrs/spotify-webapi";

const method = await new ClientCredentialsMethod(CLIENT_ID, CLIENT_SECRET, {
    autoRefresh: true
}).authenticate();

// Responses will have types in the future...
const data: any = await Routes.request(method, {
    href: { // These are automatically type checked by typescript.
        method: HttpMethods.GET,
        uri: "https://api.spotify.com/v1/search",
    },
    options: {
        q: "505",
        type: [ "track" ]
    }
} satisfies SearchTransaction);
```

# 🙌 Sources / Acknowledgements

- Spotify Web API Documentation: [Click here](https://developer.spotify.com/documentation/web-api)
