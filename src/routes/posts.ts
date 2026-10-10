import express from "express"
// import { config } from "dotenv"

import { prisma } from "./../lib/prisma.js"
import { auth } from "./../lib/auth.js";

import { fromNodeHeaders } from "better-auth/node";

import escapeHtml from "escape-html";

const router = express.Router();

// router.get('/', (req, res) => {
//   res.render('index', {
//     title: title,
//   });
// });

router.get('/list', async (req, res) => {
  // console.log(req)

  const threadId = (req.query as any).t;
  if (!threadId) {
    return res.status(400).json({
        error: "不正なリクエスト",
    });
  }

  const posts = await prisma.posts.findMany({
    take: 1000,
    orderBy: {
        createdAt: "asc"
    },
    where: {
        threadId: threadId
    }
  })

  const authorId_author: Record<string, any> = {};

  let count = 1;
  const resList = [];
  for (const post of posts) {
    let author;
    if (!authorId_author[post.authorId]) {
        author = await prisma.user.findFirst({
            where: {
                id: post.authorId
            }
        })
        if (!author) {
            continue
        } else {
            authorId_author[post.authorId] = author
        }
    } else {
        author = authorId_author[post.authorId];
    }

    // console.log(author)

    resList.push({
        content: escapeHtml(post.content),
        authorId: post.authorId,
        authorName: author.name,
        createdAt: post.createdAt,
        count: count
    })

    count += 1;
  }
  

  res.json({
    posts: resList
  })
});

router.post('/create', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({
        error: "ログインしていません",
    });
  }

  // console.log(req.body)

  const json = req.body;

  const content = json.content;
  if (!content) {
    return res.status(400).json({
        error: "不正なリクエスト",
    });
  }

  const threadId = json.threadId;
  if (!threadId) {
    return res.status(400).json({
        error: "不正なリクエスト",
    });
  }

  await prisma.posts.create({
    data: {
        content: content,
        threadId: threadId,
        authorId: session.user.id,
    }
  })

  res.json({
    status: "ok",
    post: {
        content: escapeHtml(content),
        threadId: threadId,
        authorId: session.user.id,
    }
  })
});

export default router