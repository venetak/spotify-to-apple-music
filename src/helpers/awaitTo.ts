import { resolve } from "q";
import { AnyRecord } from "dns";

export function awaitTo(callback: Promise<any>): any {
    return new Promise(resolve => {
        callback
            .then((data) => resolve([null, data]))
            .catch((error) => resolve([error, null]))
    })
}