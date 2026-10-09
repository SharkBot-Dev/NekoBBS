import express from "express"
// import { config } from "dotenv"

import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

router.get("/me", async (req, res) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({
                error: "ログインしていません",
            });
        }

        const account = await prisma.account.findFirst({
            where: {
                userId: session.user.id,
                providerId: "discord",
            },
            select: {
                accountId: true,
            },
        });

        res.json({
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            },
            discord: account ? {
                id: account.accountId,
            } : null,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});

export default router