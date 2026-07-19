import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Smart API Builder backend listening on port ${PORT}`);
});
