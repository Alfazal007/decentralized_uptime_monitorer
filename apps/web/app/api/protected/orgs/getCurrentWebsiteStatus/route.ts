import { tryCatchPromise } from "@/app/helper/tryCatch";
import { prismaClient } from "@repo/database";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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
    let intOrgId = parseInt(orgId)
    if (!intOrgId) {
        return Response.json({
            orgId,
            orgName
        }, {
            status: 401
        })
    }

    const websiteStatusWithTimeStampResult = await tryCatchPromise(prismaClient.website.findMany({
        where: {
            organizationId: intOrgId
        }, select: {
            id: true,
            url: true,
            statusTimeStamps: {
                orderBy: {
                    createdAt: "desc"
                },
                take: 10
            }
        }
    }))
    if (websiteStatusWithTimeStampResult.error) {
        return Response.json({ error: "Issue fetching the data" }, {
            status: 400
        })
    }

    return Response.json(websiteStatusWithTimeStampResult.data, {
        status: 200
    })
}
