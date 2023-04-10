export class UnsupportedOperationError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "UnsupportedOperationError";
    }

}

export class SpotifyError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "SpotifyError";
    }
}

export class HttpApiError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "HttpApiError";
    }
}