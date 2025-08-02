import {
  HTTPSTATUS,
  httpStatusCodeType,
} from '../../../infrastructure/configs/http';

export class AppError {
  message: string;
  statusCode: httpStatusCodeType;

  constructor(
    message: string,
    statusCode: httpStatusCodeType = HTTPSTATUS.BAD_REQUEST,
  ) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
