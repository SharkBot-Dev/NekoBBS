import express from "express"
import { config } from "dotenv"

config();

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

import { title } from "./data/bbs.js"

import bbs from "./routes/bbs.js";
import user from "./routes/api/user.js";
import threads from "./routes/api/threads.js";
import posts from "./routes/api/posts.js";
import admins from "./routes/api/admin.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/bbs', bbs);
app.use('/api/users', user);
app.use('/api/threads', threads);
app.use('/api/posts', posts);
app.use('/api/admin', admins);

app.use(express.static('public'));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.set('view engine', 'ejs');

// app.use('/users', bbsRouter);

app.get('/', (req, res) => {
  res.render('index', {
    title: title,
  })
});

app.get('/api/ping', (req, res) => {
  res.send('Pong!');
});

app.listen(port, () => {
  console.log(`NekoBBS app listening on port ${port}`);
});