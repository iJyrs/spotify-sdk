export class UnsupportedOperationError extends Error {

    public constructor(message?: string) {
        super(message);

        this.name = "UnsupportedOperationError";
    }

}