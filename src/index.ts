export * from "./client";

export * from "./authentication/AuthenticationMethod";
export * from "./authentication/UserVerifiedMethod";

export * from "./authentication/defaults/AuthorizationCodeMethod";
export * from "./authentication/defaults/ClientCredentialsMethod";
export * from "./authentication/defaults/ImplictGrantMethod";

export class UnsupportedOperationError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "UnsupportedOperationError";
    }

}