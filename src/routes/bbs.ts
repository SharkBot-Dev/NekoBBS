import express from "express"
// import { config } from "dotenv"

import { title } from "./../data/bbs.js"

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: title,
    threads: 'ExpressとEJSへようこそ！'
  });
});

router.get('/profile', (req, res) => {
  res.send('プロフィールページ');
});

export default router