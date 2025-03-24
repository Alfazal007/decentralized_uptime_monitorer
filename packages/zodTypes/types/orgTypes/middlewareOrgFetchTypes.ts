import { z } from "zod";

export const MiddlewareOrgFetchType = z.object({
    secret: z.string(),
    orgId: z.number(),
    name: z.string(),
});
