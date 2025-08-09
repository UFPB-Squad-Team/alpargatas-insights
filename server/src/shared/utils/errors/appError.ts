import { HTTPSTATUS, httpStatusCodeType } from '../../config/http';

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
