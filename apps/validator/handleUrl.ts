export async function handleUrl(callbackId: string, url: string, socket: WebSocket) {
    let errorMessageToSend = {
        statusCode: 400,
        callbackId: callbackId,
        type: "Callback"
    }
    try {
        const response = await fetch(url, {
            method: "GET"
        });
        let messageToSend = {
            statusCode: response.status,
            callbackId: callbackId,
            type: "Callback"
        }
        socket.send(JSON.stringify(messageToSend))
    } catch (err) {
        socket.send(JSON.stringify(errorMessageToSend))
    }
}
