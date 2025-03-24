import { NextRequest } from "next/server";
import { tryCatchPromise } from "../../../helper/tryCatch";
import { MiddlewareOrgFetchType } from "@repo/zodtypes/types/orgTypes/middlewareOrgFetchTypes";
import { prismaClient } from "@repo/database";

export async function POST(req: NextRequest) {
    const body = await tryCatchPromise(req.json());
    if (body.error) {
        return Response
            .json({ error: "no user input" }, {
                status: 400
            })
    }
    const zodOutput = MiddlewareOrgFetchType.safeParse(body.data);
    if (!zodOutput.success) {
        return Response.json({}, {
            status: 400
        });
    }
    const orgDataResult = await tryCatchPromise(
        prismaClient.organization.findFirst({
            where: {
                AND: [
                    {
                        id: zodOutput.data.orgId
                    },
                    {
                        name: zodOutput.data.name
                    },
                ]
            },
            select: {
                id: true
            }
        })
    )

    if (orgDataResult.error || !orgDataResult.data) {
        return Response
            .json({ error: "no user found" }, {
                status: 404
            })
    }
    return Response
        .json({}, {
            status: 200
        })
}
