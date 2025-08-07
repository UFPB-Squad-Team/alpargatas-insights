
import express, { Request, Response } from "express"
import cors from "cors"
import { config } from './infrastructure/configs/app';
import { errorHandling } from './infrastructure/http/middleware/errorHandling';

const app = express();
// const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: config.FRONTEND_ORIGIN,
  credentials: true
}))

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    port: config.PORT,
    environment: config.NODE_ENV,
  });
});

app.use(errorHandling)


export { app }

