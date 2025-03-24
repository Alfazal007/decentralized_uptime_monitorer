import { SignJWT } from "jose"
import { envFiles } from "../../config"
import { Result, tryCatchPromise } from "./tryCatch"


export async function generateAccessToken(name: string, id: number): Promise<Result<string, Error>> {
    const alg = 'HS256'

    const jwt = await tryCatchPromise(
        new SignJWT({ name, id })
            .setProtectedHeader({ alg })
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(envFiles.accessTokenSecret))
    )
    return jwt
}
