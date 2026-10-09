import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma.js"

import { config } from "dotenv"

config();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            scope: ["identify", "email"],
        },
    },
    trustedOrigins: [
        "http://localhost:3000",
    ],
});