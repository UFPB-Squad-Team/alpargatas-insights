import dotenv from 'dotenv';
dotenv.config();

import connectDataBase from './infrastructure/configs/connectDataBase';
import { config } from './infrastructure/configs/app';

import { app } from './app';

app.listen(config.PORT, async () => {
  console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDataBase();
});
