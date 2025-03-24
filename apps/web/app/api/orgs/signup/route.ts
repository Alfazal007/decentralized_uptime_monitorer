import { NextRequest, NextResponse } from "next/server";
import { tryCatchPromise } from "../../../helper/tryCatch";
import { SignupOrg } from "@repo/zodtypes/types/orgTypes/signupOrg";
import { prismaClient } from "@repo/database";
import bcrypt from "bcryptjs";

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

    // this should be empty
    if (isPresentInDataBase.data) {
        return Response.json({ error: "Use a different name" }, {
            status: 400
        })
    }
    const hashedPasswordResult = await tryCatchPromise(bcrypt.hash(zodOutput.data.password, 12));
    if (hashedPasswordResult.error) {
        return Response.json({ error: "Issue hashing the password before storing it into the datbase" }, {
            status: 500
        })
    }
    const newUserResult = await tryCatchPromise(
        prismaClient.organization.create({
            data: {
                name: zodOutput.data.name,
                password: hashedPasswordResult.data
            },
            select: {
                id: true
            }
        })
    )
    if (newUserResult.error) {
        return Response.json({ error: "Issue writing to the database" }, {
            status: 500
        })
    }

    return Response.json({
        name: zodOutput.data.name,
        id: newUserResult.data.id
    }, { status: 201 })
}
