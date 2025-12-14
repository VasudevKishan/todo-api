import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    username?: string;
    roles?: string[];
  }
}
