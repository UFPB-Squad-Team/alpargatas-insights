import 'express-async-errors';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './infrastructure/configs/app';
import { errorHandling } from './infrastructure/http/middleware/errorHandling';
import { schoolRoutes } from './infrastructure/http/routes/schoolRoutes';

const app = express();
// const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

app.use(schoolRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    port: config.PORT,
    environment: config.NODE_ENV,
  });
});

app.use(errorHandling);

export { app };
