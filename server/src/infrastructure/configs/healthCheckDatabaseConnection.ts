import mongoose from 'mongoose';
import { AppError } from '../../shared/utils/errors/appError';
import { HTTPSTATUS } from '../../shared/config/http';

const healthCheckconnectDataBase = async () => {
  const state = mongoose.connection.readyState;

  if (state !== 1) {
    throw new AppError(
      'Database connection is not healthy',
      HTTPSTATUS.SERVICE_UNAVAILABLE,
    );
  }

  try {
    await mongoose.connection.db?.admin().ping();
  } catch (error) {
    throw new AppError(
      'Database ping failed status',
      HTTPSTATUS.SERVICE_UNAVAILABLE,
    );
  }

  return true;
};

export default healthCheckconnectDataBase;
