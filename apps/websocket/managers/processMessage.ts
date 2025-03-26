import type { ServerWebSocket } from "bun";
import { isUserValidator } from "..";

export enum IncomingMessageType {
    Signup = "Signup",
    Signin = "Signin",
    Callback = "Callback",
    None = "None",
}

export type SignupSigninData = {
    username: string,
    password: string
}

export type CallbackData = {
    statusCode: number,
    callbackId: string,
}

export class MessageManager {
    private static messageManager: MessageManager;
    private callbackMap: Map<ServerWebSocket<unknown>, Map<string, () => {}[]>>;
    // ws -> callbackId -> callback_function

    private constructor() {
        this.callbackMap = new Map();
    }

    static getInstance(): MessageManager {
        if (!MessageManager.messageManager) {
            MessageManager.messageManager = new MessageManager();
        }
        return MessageManager.messageManager;
    }

    removeSocketConnection(ws: ServerWebSocket<unknown>) {
        this.callbackMap.delete(ws);
    }

    removeCallback(ws: ServerWebSocket<unknown>, callbackId: string) {
        let requiredMap = this.callbackMap.get(ws);
        requiredMap?.delete(callbackId);
        if (requiredMap?.size == 0) {
            this.callbackMap.delete(ws)
        }
    }

    addCallback(ws: ServerWebSocket<unknown>, callbackId: string) {
    }

    convertAndProcessMessage(ws: ServerWebSocket<unknown>, jsonMessage: object): [IncomingMessageType, SignupSigninData | CallbackData | null] {
        let typeOfMessage = this.typeOfMessageFinder(jsonMessage)
        if (typeOfMessage == IncomingMessageType.None) {
            return [IncomingMessageType.None, null]
        }
        let [isValidMessage, messageData] = this.messageDataGiver(typeOfMessage, jsonMessage)
        if (!isValidMessage || !messageData) {
            return [IncomingMessageType.None, null]
        }
        switch (typeOfMessage) {
            case IncomingMessageType.Signup:
                let signUpData = messageData as SignupSigninData
                if (typeof signUpData.username == "string" && typeof signUpData.password == "string") {
                    return [IncomingMessageType.Signup, signUpData]
                }
                return [IncomingMessageType.None, null]
            case IncomingMessageType.Signin:
                let signInData = messageData as SignupSigninData
                if (typeof signInData.username == "string" && typeof signInData.password == "string") {
                    return [IncomingMessageType.Signin, signInData]
                }
                return [IncomingMessageType.None, null]
            case IncomingMessageType.Callback:
                if (!isUserValidator(ws)) {
                    return [IncomingMessageType.None, null]
                }
                let callbackMessageData = messageData as CallbackData
                if (typeof callbackMessageData.statusCode == "number") {
                    return [IncomingMessageType.Callback, callbackMessageData]
                }
                return [IncomingMessageType.None, null]
            default:
                return [IncomingMessageType.None, null]
        }
    }

    private typeOfMessageFinder(jsonMessage: any): IncomingMessageType {
        switch (jsonMessage.type) {
            case IncomingMessageType.Signup:
                return IncomingMessageType.Signup
            case IncomingMessageType.Signin:
                return IncomingMessageType.Signin
            case IncomingMessageType.Callback:
                return IncomingMessageType.Callback
            default:
                return IncomingMessageType.None
        }
    }

    private messageDataGiver(typeOfMessage: IncomingMessageType, jsonMessage: any): [boolean, SignupSigninData | CallbackData | null] {
        switch (typeOfMessage) {
            case IncomingMessageType.Signup:
                if (!jsonMessage.username || !jsonMessage.password) {
                    return [false, null]
                }
                return [true, {
                    username: jsonMessage.username,
                    password: jsonMessage.password,
                }]
            case IncomingMessageType.Signin:
                if (!jsonMessage.username || !jsonMessage.password) {
                    return [false, null]
                }
                return [true, {
                    username: jsonMessage.username,
                    password: jsonMessage.password,
                }]
            case IncomingMessageType.Callback:
                if (!jsonMessage.callbackId || !jsonMessage.statusCode) {
                    return [false, null]
                }
                return [true, {
                    statusCode: jsonMessage.statusCode,
                    callbackId: jsonMessage.callbackId,
                }]
            default:
                return [false, null]
        }
    }
}
