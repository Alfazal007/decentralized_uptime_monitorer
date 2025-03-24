import { NextRequest } from "next/server";
import { tryCatchPromise } from "../../../../helper/tryCatch";
import { prismaClient } from "@repo/database";

export async function POST(req: NextRequest) {
    const orgId = req.headers.get("x-org-id");
    const orgName = req.headers.get("x-org-name");
    if (!orgName || !orgId) {
        return Response.json({
            orgId,
            orgName
        }, {
            status: 401
        })
    }
    const bodyResult = await tryCatchPromise(req.json());
    if (bodyResult.error) {
        return Response
            .json({ error: "no user input" }, {
                status: 400
            })
    }
    if (!bodyResult.data.url) {
        return Response
            .json({ error: "Url not provided" }, {
                status: 400
            })
    }

    const existingUrlInDatabaseResult = await tryCatchPromise(
        prismaClient.website.findFirst({
            where: {
                AND: [
                    {
                        url: bodyResult.data.url
                    },
                    {
                        organizationId: parseInt(orgId)
                    },
                    {
                        deleted: false
                    }
                ]
            }
        })
    )
    if (existingUrlInDatabaseResult.error) {
        return Response
            .json({ error: "Issue talking to the database" }, {
                status: 500
            })
    }
    if (existingUrlInDatabaseResult.data) {
        return Response
            .json({ error: "This website is already being monitored" }, {
                status: 400
            })
    }
    const newWebsiteRegisterResult = await tryCatchPromise(prismaClient.website.create({
        data: {
            url: bodyResult.data.url,
            organizationId: parseInt(orgId)
        },
        select: {
            id: true,
            organizationId: true,
            url: true,
        }
    }))
    if (newWebsiteRegisterResult.error) {
        return Response
            .json({ error: "Issue writing to the database" }, {
                status: 500
            })
    }
    if (!newWebsiteRegisterResult.data) {
        return Response
            .json({ error: "Issue writing to the database" }, {
                status: 400
            })
    }
    return Response.json(newWebsiteRegisterResult.data)
}
