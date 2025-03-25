import type { ServerWebSocket } from "bun";
import { processMessage } from "./helpers/processMessage";
import { IncomingMessageType, MessageManager } from "./managers/processMessage";

let connectedUsers = new Set();
let connectedValidators = new Set();
let messageManager = MessageManager.getInstance();

export function isUserValidator(ws: ServerWebSocket<unknown>) {
    return connectedValidators.has(ws);
}

export function isUserConnected(ws: ServerWebSocket<unknown>) {
    return connectedUsers.has(ws);
}

let server = Bun.serve({
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },

    websocket: {
        open(ws) {
            connectedUsers.add(ws)
        },
        close(ws) {
            connectedUsers.delete(ws);
            connectedValidators.delete(ws)
        },
        message(ws, message) {
            let [isValidMessage, jsonMessage] = processMessage(message.toString());
            if (!isValidMessage) {
                return;
            }
            let [typeOfMessage, messageToWriteToDB] = messageManager.convertAndProcessMessage(ws, jsonMessage)
            if (!messageToWriteToDB || !typeOfMessage) {
                return;
            }

            switch (typeOfMessage) {
                case IncomingMessageType.Signup:
                    // TODO:: send message to the database, upsert
                    break
                case IncomingMessageType.Signin:
                    // TODO:: query server and update the current state
                    break
                case IncomingMessageType.Callback:
                    // TODO:: this is for  other things
                    break
                default:
                    break
            }
        },
    },
    port: 3001
});

console.log(`Listening on ${server.hostname}:${server.port}`);
