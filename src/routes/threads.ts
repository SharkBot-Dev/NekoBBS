import express from "express"
// import { config } from "dotenv"

import { prisma } from "./../lib/prisma.js"
import { auth } from "./../lib/auth.js";
import createId from "./../lib/createId.js"
import { fromNodeHeaders } from "better-auth/node";

const router = express.Router();

// router.get('/', (req, res) => {
//   res.render('index', {
//     title: title,
//   });
// });

router.get('/list', async (req, res) => {
  const threads = await prisma.threads.findMany({
    take: 30,
    orderBy: {
        createdAt: "desc"
    },
  })

  const resList = [];
  for (const thread of threads) {
    resList.push({
        title: thread.title,
        id: thread.threadId
    })
  }
  

  res.json({
    threads: resList
  })
});

router.get('/create', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({
        error: "ログインしていません",
    });
  }

  const title = req.body.title;
  if (!title) {
    return res.status(400).json({
        error: "不正なリクエスト",
    });
  }

  const threadId = createId();
  await prisma.threads.create({
    data: {
        title: title,
        threadId: threadId,
        ownerId: session.user.id,
    }
  })

  res.json({
    status: "ok",
    thread: {
      id: threadId
    }
  })
});

export default router