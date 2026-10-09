import express from "express"
import { config } from "dotenv"

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

import { title } from "./data/bbs.js"

import bbs from "./routes/bbs.js";
import user from "./routes/user.js";
import threads from "./routes/threads.js";

config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/bbs', bbs);
app.use('/api/users', user);
app.use('/api/threads', threads);

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