import express from "express"
// import { config } from "dotenv"

import { title } from "./../data/bbs.js"
import { prisma } from "../lib/prisma.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

const router = express.Router();

// router.get('/', (req, res) => {
//   res.render('index', {
//     title: title,
//   });
// });

router.get('/', (req, res) => {
  res.render('bbs', {
    title: title,
  });
});

router.get('/threads', async (req, res) => {
  const threadId = (req.query as any).t;

  const thread = await prisma.threads.findFirst({
    where: {
      threadId: threadId
    }
  })

  if (!thread) {
    res.send("不明なスレッドです。");
    return;
  }

  res.render('threadView', {
    title: title + `- ${thread?.title}`,
    threadId: threadId,
    threadName: thread.title
  });
});

router.get('/admin/mute', async (req, res) => {
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

  res.render('muteUserAdmin', {
    title: title + `- ユーザーのミュート`,
  });
})

router.get('/admin/delete-mute', async (req, res) => {
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

  const query = req.query;

  const authorId = query.authorId;
  if (!authorId) {
    return res.status(400).json({
        error: "投稿者を指定する必要があります。",
    });
  }

  res.render("deleteMuteUserAdmin", {
    muteUserId: authorId
  })
})

export default router