import express from "express"
import { config } from "dotenv"

import bbsRouter from "./routes/bbs.js"

config();

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');

app.use('/users', bbsRouter);

app.get('/api/ping', (req, res) => {
  res.send('Pong!');
});

app.listen(port, () => {
  console.log(`NekoBBS app listening on port ${port}`);
});