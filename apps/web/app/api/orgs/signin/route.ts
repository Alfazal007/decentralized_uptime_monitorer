import { NextRequest } from "next/server";
import { tryCatchPromise } from "../../../helper/tryCatch";
import { SignInOrg } from "@repo/zodtypes/types/orgTypes/signinOrgs";
import { prismaClient } from "@repo/database";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../../../helper/generateAccesstoken";

export async function POST(req: NextRequest) {
    const body = await tryCatchPromise(req.json());
    if (body.error) {
        return Response
            .json({ error: "no user input" }, {
                status: 400
            })
    }
    const zodOutput = SignInOrg.safeParse(body.data);
    if (!zodOutput.success) {
        let zodErrors = zodOutput.error.errors.map((err) => `Field: ${err.path} - ${err.message}`);
        return Response.json({ errors: zodErrors }, {
            status: 400
        });
    }
    const exisingUserFromDatabaseResult = await tryCatchPromise(prismaClient.organization
        .findFirst({
            where: {
                name: zodOutput.data.name
            }
        }));
    if (exisingUserFromDatabaseResult.error) {
        return Response.json({ error: "Issue talking to the database" }, {
            status: 500
        });
    }
    if (!exisingUserFromDatabaseResult.data) {
        return Response.json({ error: "Organization not found" }, {
            status: 404
        });
    }
    400
    const isValidPasswordResult = await tryCatchPromise(bcrypt.compare(zodOutput.data.password, exisingUserFromDatabaseResult.data.password));
    if (isValidPasswordResult.error) {
        return Response.json({ error: "Issue comparing the password" }, {
            status: 500
        });
    }
    if (!isValidPasswordResult.data) {
        return Response.json({ error: "Invalid password" }, {
            status: 400
        });
    }
    const accessToken = await generateAccessToken(zodOutput.data.name, exisingUserFromDatabaseResult.data.id);
    if (accessToken.error) {
        return Response.json({ error: "Issue generating accesstoken" }, {
            status: 500
        });
    }

    const headers = new Headers();
    headers.append(
        "Set-Cookie",
        `accessToken=${accessToken.data}; HttpOnly; Secure; SameSite=none; Max-Age=${60 * 60 * 24}; Path=/`
    );
    headers.append(
        "Set-Cookie",
        `id=${exisingUserFromDatabaseResult.data.id}; HttpOnly; Secure; SameSite=none; Max-Age=${60 * 60 * 24}; Path=/`
    );
    return Response.json({ accessToken: accessToken.data, id: exisingUserFromDatabaseResult.data.id }, {
        status: 200,
        headers
    });
}
