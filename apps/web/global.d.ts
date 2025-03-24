import { NextRequest } from "next/server";

declare module "next/server" {
    interface NextRequest {
        user?: {
            id: number;
            name: string;
        };
    }
}
