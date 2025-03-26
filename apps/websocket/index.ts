import type { ServerWebSocket } from "bun";
import { processMessage } from "./helpers/processMessage";
import { IncomingMessageType, MessageManager, type SignupSigninData } from "./managers/processMessage";
import { signUpCallback } from "./processCallbacks/signupProcessor";
import type { OutgoingMessageType } from "./processCallbacks/type";
import { signInCallback } from "./processCallbacks/signinProcessor";

let connectedUsers = new Set();
export let connectedValidators = new Set();
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
        async message(ws, message) {
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
                    console.log("signup message")
                    let messageToProcessSignup = messageToWriteToDB as SignupSigninData;
                    let signUpResult = await signUpCallback(messageToProcessSignup.username, messageToProcessSignup.password)
                    let messageToSendSignup: OutgoingMessageType = {
                        statusData: signUpResult
                    }
                    ws.send(JSON.stringify(messageToSendSignup))
                    break

                case IncomingMessageType.Signin:
                    console.log("signin message")
                    let messageToProcessSignin = messageToWriteToDB as SignupSigninData;
                    let signInResult = await signInCallback(messageToProcessSignin.username, messageToProcessSignin.password, ws)
                    let messageToSendSignin: OutgoingMessageType = {
                        statusData: signInResult
                    }
                    ws.send(JSON.stringify(messageToSendSignin))
                    break

                case IncomingMessageType.Callback:
                    console.log("callback message")
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
