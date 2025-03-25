import { tryCatch } from "./tryCatch";

export function processMessage(stringMessage: string): [boolean, object] {
    let messageResult = tryCatch(
        () =>
            JSON.parse(stringMessage)
    );
    if (messageResult.error) {
        return [false, {}]
    }
    return [true, messageResult.data]
}
