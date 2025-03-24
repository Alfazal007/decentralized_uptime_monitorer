import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { envFiles } from './config'
import * as jose from "jose"
import { tryCatchPromise } from './app/helper/tryCatch'
import axios from 'axios'

const secret = new TextEncoder().encode(
    envFiles.accessTokenSecret,
)

export async function middleware(request: NextRequest) {
    let accessToken = request.cookies.get("accessToken")?.value
    let id = request.cookies.get("id")?.value
    if (!accessToken || !id) {
        return Response.json({
            error: "Relogin to refresh your credentials"
        }, {
            status: 401
        })
    }
    let intId = parseInt(id)
    if (!intId) {
        return Response.json({
            error: "Relogin to refresh your credentials"
        }, {
            status: 401
        })
    }

    const jwtResult = await
        tryCatchPromise(
            jose.jwtVerify(accessToken, secret)
        )
    if (jwtResult.error) {
        return Response.json({
            error: jwtResult.error.message
        }, {
            status: 401
        })
    }
    if (!jwtResult.data.payload.name) {
        return Response.json({
            error: "Relogin to refresh your credentials"
        }, {
            status: 401
        })
    }


    const dataForAxios = {
        secret: envFiles.accessTokenSecret,
        orgId: intId,
        name: jwtResult.data.payload.name
    }
    const doesUserExistResult = await tryCatchPromise(
        axios
            .post("http://localhost:3000/api/orgs/getSigninOrgForMiddleware",
                dataForAxios))

    if (doesUserExistResult.error || doesUserExistResult.data.status != 200) {
        return Response.json({
            error: "Relogin to refresh your credentials"
        }, {
            status: 401
        })
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-org-id", `${intId}`);
    requestHeaders.set("x-org-name", jwtResult.data.payload.name as string);

    return NextResponse.next({
        headers: requestHeaders
    });
}

export const config = {
    matcher: '/api/protected/:function*',
}
