import { AuthenticationMethod } from "../authentication/AuthenticationMethod";
import { EndpointTransaction_t, TransactionHref} from "./Endpoints";
import { HttpApiError, Immutable, Mutable } from "../index";

export enum HttpMethods { GET = "GET", POST = "POST", PUT = "PUT", DELETE = "DELETE" }
export type HttpContentTypes = "application/json" | "application/x-www-form-urlencoded";
export type RequestEndpointOptions = Immutable<{
    override?: Omit<EndpointTransaction_t, "href"> & {
        href?: Immutable<{
            method?: HttpMethods,
            content_type?: HttpContentTypes,
            uri?: string
        }>
        overwrite?: boolean
    }
}>

export class Routes {

    protected static mergeObjects(target: any, source: any, overwrite = false): void {
        for (const key in source) {
            if (typeof source[key] === "object" && source[key] !== null) {
                if (!target[key]) target[key] = Array.isArray(source[key]) ? [] : {};
                Routes.mergeObjects(target[key], source[key], overwrite);
            } else if (overwrite || !(key in target)) {
                target[key] = source[key];
            }
        }
    }

    public static async request<T extends EndpointTransaction_t>(method: AuthenticationMethod, transaction: Mutable<T>, options?: Mutable<RequestEndpointOptions>): Promise<T> {
        if (!method.verified)
            throw new Error("Bad Request! You must verify the authentication method before making requests!");

        let swapped: boolean = true;
        if(options && options.override) {
            Routes.mergeObjects(options.override, transaction);
            [transaction, options.override] = [options.override as any, transaction];
        } else swapped = false;

        const uri = new URL(transaction.href.uri);

        const requestInit: RequestInit = {
            method: transaction.href.method,
            headers: {
                "Authorization": "Bearer " + method.token?.access_token!,
                "Content-Type": transaction.href.content_type ?? "application/x-www-form-urlencoded"
            }
        };

        if(transaction.options !== undefined) {
            if (transaction.href.content_type === "application/json")
                requestInit.body = JSON.stringify(transaction.options);
            else for (const [key, value] of Object.entries(transaction.options))
                uri.searchParams.append(key, value as string);
        }

        const response = await fetch(uri, requestInit);

        if(!response.ok)
            throw new HttpApiError("Unable to fetch data! Status code: " + response.status);

        // Swap the transaction object back to its original state.
        // Its important that this is swapped before writing to the response.

        if(swapped && !(transaction as any)?.overwrite)
            [transaction, options!.override] = [options?.override as any, transaction];

        try {
            transaction.response = await response.json();

            const href: Mutable<TransactionHref> = transaction.href;
            href.content_type = href.content_type ?? "application/x-www-form-urlencoded";

            const obj: any = transaction;
            if(obj["overwrite"] !== undefined)
                delete obj["overwrite"];

        }catch (err) { }

        return transaction;
    }

}
