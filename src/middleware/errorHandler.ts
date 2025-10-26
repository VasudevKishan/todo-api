import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logEvents } from './logger.js';

const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);
  res.json({ message: err.message });
};

export { errorHandler };
