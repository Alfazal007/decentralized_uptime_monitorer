import { handleUrl } from "./handleUrl";
import { StatusSignupResponseFromServer } from "./types";

let isSignedUp = false;
let isSignedIn = false;

export function startSocket(username: string, password: string) {
    console.log("starting the socket")
    console.log({ username, password })
    const socket = new WebSocket("ws://localhost:3001")
    socket.onopen = async () => {
        console.log("socket connected")
        signup(socket, username, password);
    }
    socket.onclose = () => {
        console.log("socket disconnected")
        process.exit()
    }
}

function signup(socket: WebSocket, username: string, password: string) {
    socket.send(JSON.stringify({
        password,
        username,
        "type": "Signup"
    }))

    socket.onmessage = (data: any) => {
        // this is not supposed to procecss messages of callback
        if (isSignedIn) {
            return;
        }
        const status = JSON.parse(data.data);
        console.log({ status })
        let statusData = status.statusData as StatusSignupResponseFromServer;
        if (!isSignedUp) {
            if (statusData == StatusSignupResponseFromServer.Error) {
                console.error("Issue with signup")
                process.exit(1)
            }
            isSignedUp = true;
            signin(socket, username, password)
        }
        else if (!isSignedIn) {
            if (statusData == StatusSignupResponseFromServer.Error || statusData == "Failure") {
                console.error("Issue with signin")
                process.exit(1)
            }
            isSignedIn = true;
            socket.onmessage = async (data: any) => {
                console.log({ data })
                const jsonData = JSON.parse(data.data);
                const { callbackId, url } = jsonData;
                if (!callbackId || !url) {
                    return;
                }
                await handleUrl(callbackId, url, socket)
            }
        }
    }
}

function signin(socket: WebSocket, username: string, password: string) {
    socket.send(JSON.stringify({
        password,
        username,
        "type": "Signin"
    }))
}
