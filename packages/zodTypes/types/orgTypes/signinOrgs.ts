import { z } from "zod";

export const SignInOrg = z.object({
    name: z.string()
        .max(20, "The max length for org name should be 20")
        .min(6, "The min length for org name should be 6"),
    password: z.string()
        .max(20, "The max length for password name should be 20")
        .min(6, "The min length for password name should be 6"),
});
