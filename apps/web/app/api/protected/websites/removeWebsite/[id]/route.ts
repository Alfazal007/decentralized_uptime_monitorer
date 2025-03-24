import { NextRequest } from "next/server";
import { tryCatchPromise } from "../../../../../helper/tryCatch";
import { prismaClient } from "@repo/database";

export async function DELETE(req: NextRequest,
    context: Promise<{ params: Promise<{ id: string }> }>) {
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


    const resolvedContext = await context;
    const resolvedParams = await resolvedContext.params;
    const websiteIdToDelete = resolvedParams.id;

    const findWebsiteResult = await tryCatchPromise(
        prismaClient.website.findFirst({
            where: {
                AND: [
                    {
                        id: parseInt(websiteIdToDelete)
                    },
                    {
                        organizationId: parseInt(orgId)
                    },
                    {
                        deleted: false
                    }
                ]
            },
            select: {
                id: true
            }
        })
    )

    if (findWebsiteResult.error) {
        return Response.json({
            errors: "Issue talking to the database"
        }, {
            status: 500
        })
    }

    if (!findWebsiteResult.data) {
        return Response.json({
            errors: "Not found"
        }, {
            status: 404
        })
    }
    const deleteResult = await tryCatchPromise(prismaClient.website.update({
        where: {
            id: findWebsiteResult.data.id
        },
        data: {
            deleted: true
        }
    }))
    if (deleteResult.error) {
        return Response.json({
            errors: "Issue talking to the database"
        }, {
            status: 500
        })
    }
    return Response.json({
        message: 'success'
    })
}

