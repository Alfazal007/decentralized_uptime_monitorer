import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "../../helper/tryCatch";

export async function POST(req: NextRequest) {
    const body = await tryCatch(req.json());
    if (body.error) {
        return NextResponse
            .json({ error: "no user input" }, {
                status: 400
            })
    }

    console.log({ body: body.data })
    return Response.json({ username: "someone", email: "someone@gmail.com" })
}
