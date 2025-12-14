import rateLimit from 'express-rate-limit';

import { logEvents } from './logger.js';

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      'Too many login atempts from this IP, please try again after a 60 seconds pause',
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      'errLog.log'
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disable the `X-RateLimit-*` headers
  // above 2 options are as recomended in the docs for express-rate-limit
});

export default loginLimiter;
