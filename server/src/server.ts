import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import connectDataBase from './infrastructure/config/connectDataBase';
import { config } from './infrastructure/config/app';

const app = express();
// const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    port: config.PORT,
    environment: config.NODE_ENV,
  });
});

app.listen(config.PORT, async () => {
  console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDataBase();
});
