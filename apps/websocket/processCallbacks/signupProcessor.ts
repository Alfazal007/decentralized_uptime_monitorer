import { tryCatchPromise } from "../helpers/tryCatch";
import { prismaClient } from "@repo/database";
import bcrypt from "bcryptjs";

export enum StatusSignup {
    Success = "Success",
    AccountExistsJustSignin = "AccountExistsJustSignin",
    Error = "Error",
}

export async function signUpCallback(username: string, password: string): Promise<StatusSignup> {
    let existingValidatorResult = await tryCatchPromise(
        prismaClient.validator.findFirst({
            where: {
                username
            }
        })
    )
    if (existingValidatorResult.error) {
        return StatusSignup.Error
    }

    if (!existingValidatorResult.data) {
        let hashedPasswordResult = await tryCatchPromise(bcrypt.hash(password, 12))
        if (hashedPasswordResult.error) {
            return StatusSignup.Error
        }
        let newValidatorResult = await tryCatchPromise(
            prismaClient.validator.create({
                data: {
                    username,
                    password: hashedPasswordResult.data
                }
            })
        )
        if (newValidatorResult.error) {
            return StatusSignup.Error
        } else {
            return StatusSignup.Success
        }
    } else {
        return StatusSignup.AccountExistsJustSignin
    }
}
