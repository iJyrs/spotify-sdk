export { SpotifyClient } from "./client";

export * from "./authentication/AuthenticationMethod";
export * from "./authentication/UserVerifiedMethod";

export * from "./authentication/defaults/AuthorizationCodeMethod";
export * from "./authentication/defaults/ClientCredentialsMethod";
export * from "./authentication/defaults/ImplictGrantMethod";

export * from "./errors";

export type OmitFunction<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Immutable<T> = { readonly [P in keyof T]: T[P] }; // I know Readonly<T> exists but the name sucks :)
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };