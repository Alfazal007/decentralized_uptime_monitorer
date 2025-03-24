import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const orgId = req.headers.get("x-org-id");
    const orgName = req.headers.get("x-org-name");

    return Response.json({
        orgId,
        orgName
    })
}
