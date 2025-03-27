import type { ServerWebSocket } from "bun";
import { processMessage } from "./helpers/processMessage";
import { IncomingMessageType, MessageManager, type CallbackData, type SignupSigninData } from "./managers/processMessage";
import { signUpCallback } from "./processCallbacks/signupProcessor";
import type { OutgoingMessageType } from "./processCallbacks/type";
import { signInCallback, } from "./processCallbacks/signinProcessor";
import { tryCatchPromise } from "./helpers/tryCatch";
import { prismaClient } from "@repo/database";
import { v4 as uuidV4 } from "uuid";

let connectedUsers = new Set<ServerWebSocket<unknown>>();
export let connectedValidators = new Set<ServerWebSocket<unknown>>();
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
            messageManager.removeSocketConnection(ws)
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
                    let callbackMessageToProcess = messageToWriteToDB as CallbackData;
                    if (!callbackMessageToProcess.statusCode || !callbackMessageToProcess.callbackId) {
                        return;
                    }
                    let functionToExecute = messageManager.getCallbackFunction(ws, callbackMessageToProcess.callbackId)
                    if (!functionToExecute) {
                        return;
                    }
                    messageManager.removeCallback(ws, callbackMessageToProcess.callbackId)
                    await tryCatchPromise(functionToExecute(callbackMessageToProcess.statusCode == 200 ? "Good" : "Bad"))
                    break
                default:
                    break
            }
        },
    },
    port: 3001
});

console.log(`Listening on ${server.hostname}:${server.port}`);


setInterval(async () => {
    //setTimeout(async () => {
    let websiteUrlsResult = await tryCatchPromise(prismaClient.website.findMany({
        where: {
            deleted: false,
        },
        select: {
            url: true,
        }
    }))
    if (websiteUrlsResult.error) {
        return;
    }
    websiteUrlsResult.data.forEach((websiteUrl) => {
        connectedValidators.forEach((validator) => {
            let callbackId = uuidV4()
            let newCallbackFunction = async (status: "Good" | "Bad") => {
                try {
                    const website = await prismaClient.website.findFirst({
                        where: {
                            url: websiteUrl.url
                        }
                    })
                    if (!website) {
                        return;
                    }
                    await prismaClient.$transaction(async (tx) => {
                        await tx.statusTimeStamp.create({
                            data: { status: status, websiteId: website.id }
                        });
                    });
                } catch (err) {
                    return
                }
            }
            messageManager.addCallback(validator, callbackId, newCallbackFunction)
            validator.send(JSON.stringify({
                type: "validate",
                url: websiteUrl.url,
                callbackId
            }))
        })
    })
}, 10000)
