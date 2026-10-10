import express from "express"
// import { config } from "dotenv"

// import { title } from "./../../data/bbs.js"
import { prisma } from "../../lib/prisma.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

const router = express.Router();

router.post('/user/mute', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({
        error: "ログインしていません",
    });
  }

  const admin = await prisma.adminUsers.findFirst({
    where: {
        userId: session.user.id
    }
  })
  if (!admin) {
    const account = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            providerId: "discord",
        },
        select: {
            accountId: true,
        },
    });

    if (process.env.ADMIN_DISCORD_USER_ID != account?.accountId) {
        return res.status(403).json({
            error: "権限がありません。",
        });
    }
  }

  // console.log(req.body)

  const json = req.body;

  const authorId = json.authorId;
  if (!authorId) {
    return res.status(400).json({
        error: "投稿者を指定する必要があります。",
    });
  }

  const reason = json.reason;
  if (!reason) {
    return res.status(400).json({
        error: "理由を指定する必要があります。",
    });
  }

  await prisma.muteUsers.create({
    data: {
        userId: authorId,
        reason: reason
    }
  })

  res.json({
    status: "ok",
  })
});

router.delete('/user/mute', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({
        error: "ログインしていません",
    });
  }

  const admin = await prisma.adminUsers.findFirst({
    where: {
        userId: session.user.id
    }
  })
  if (!admin) {
    const account = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            providerId: "discord",
        },
        select: {
            accountId: true,
        },
    });

    if (process.env.ADMIN_DISCORD_USER_ID != account?.accountId) {
        return res.status(403).json({
            error: "権限がありません。",
        });
    }
  }

  // console.log(req.body)

  const query = req.query;

  const authorId = query.authorId;
  if (!authorId) {
    return res.status(400).json({
        error: "投稿者を指定する必要があります。",
    });
  }

  await prisma.muteUsers.deleteMany({
    where: {
        userId: authorId as string,
    }
  })

  res.json({
    status: "ok",
  })
});

router.get('/user/mutes', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({
        error: "ログインしていません",
    });
  }

  const admin = await prisma.adminUsers.findFirst({
    where: {
        userId: session.user.id
    }
  })
  if (!admin) {
    const account = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            providerId: "discord",
        },
        select: {
            accountId: true,
        },
    });

    if (process.env.ADMIN_DISCORD_USER_ID != account?.accountId) {
        return res.status(403).json({
            error: "権限がありません。",
        });
    }
  }

  // console.log(req.body)

  const muteUsers = await prisma.muteUsers.findMany()

  const mutes = [];
  for (const muteUser of muteUsers) {
    mutes.push({
        userId: muteUser.userId,
        reason: muteUser.reason
    })
  }

  res.json({
    status: "ok",
    mutes: mutes
  })
});

export default router