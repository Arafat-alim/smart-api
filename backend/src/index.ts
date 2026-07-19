import express from 'express';
import cors from 'cors';
import generateRouter from './routes/generate';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api', generateRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Smart API Builder backend listening on port ${PORT}`);
  });
}

export default app;
