import express from "express"
// import { config } from "dotenv"

import { title } from "./../data/bbs.js"
import { prisma } from "../lib/prisma.js";

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
  const threadId = (req.params as any).t;

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
    threadId: threadId
  });
});

export default router