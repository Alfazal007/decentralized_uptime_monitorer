import readline from "readline";
import { startSocket } from "./socket";

const rl1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl1.question("Enter username\n", (input) => {
    let username = input;
    rl1.close();
    const rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl2.question("Enter password\n", (input) => {
        let password = input;
        startSocket(username, password);
        rl2.close();
    });
});

