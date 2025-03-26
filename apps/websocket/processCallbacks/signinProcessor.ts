import { tryCatchPromise } from "../helpers/tryCatch";
import { prismaClient } from "@repo/database";
import bcrypt from "bcryptjs";
import { connectedValidators } from "..";
import type { ServerWebSocket } from "bun";

export enum StatusSignin {
    Success = "Success",
    Failure = "Failure",
}

export async function signInCallback(username: string, password: string, ws: ServerWebSocket<unknown>): Promise<StatusSignin> {
    let existingValidatorResult = await tryCatchPromise(
        prismaClient.validator.findFirst({
            where: {
                username
            }
        })
    )
    if (existingValidatorResult.error) {
        return StatusSignin.Failure
    }

    if (!existingValidatorResult.data) {
        return StatusSignin.Failure
    } else {
        let isValidPassword = await tryCatchPromise(
            bcrypt.compare(password, existingValidatorResult.data.password)
        )
        if (isValidPassword.error) {
            return StatusSignin.Failure
        }
        if (!isValidPassword.data) {
            return StatusSignin.Failure
        }
        connectedValidators.add(ws)
        return StatusSignin.Success
    }
}
