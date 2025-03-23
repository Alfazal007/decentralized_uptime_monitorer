import { NextRequest, NextResponse } from "next/server";
import { tryCatchPromise } from "../../helper/tryCatch";
import { SignupOrg } from "@repo/zodtypes/types/orgTypes/signupOrg";
import { prismaClient } from "@repo/database";
import { assert } from "node:console";

export async function POST(req: NextRequest) {
    const body = await tryCatchPromise(req.json());
    if (body.error) {
        return NextResponse
            .json({ error: "no user input" }, {
                status: 400
            })
    }

    const zodOutput = SignupOrg.safeParse(body.data);
    if (!zodOutput.success) {
        let zodErrors = zodOutput.error.errors.map((err) => `Field: ${err.path} - ${err.message}`);
        return Response.json({ errors: zodErrors }, {
            status: 400
        });
    }

    const isPresentInDataBase = await tryCatchPromise(
        prismaClient.organization.findFirst({
            where: {
                name: zodOutput.data.name
            },
            select: {
                id: true
            }
        })
    );
    if (isPresentInDataBase.error) {
        return Response.json({ error: "Issue talking to the database" }, {
            status: 500
        })
    }

    if (!isPresentInDataBase.data) {
        return Response.json({ error: "Use a different name" }, {
            status: 400
        })
    }
    // TODO:: password hash and output checks
    const newUserResult = await tryCatchPromise(
        prismaClient.organization.create({
            data: {
                name: zodOutput.data.name,
                password: zodOutput.data.password
            }
        })
    )

    return Response.json({ username: "someone", email: "someone@gmail.com" })
}
