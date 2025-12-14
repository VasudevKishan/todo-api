import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { ACCESS_TOKEN_SECRET } from '../config/env.js';
import { AccessTokenPayload } from '../types/authTypes.js';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (typeof authHeaders !== 'string' || !authHeaders?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeaders.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token not found' });
  jwt.verify(
    token,
    ACCESS_TOKEN_SECRET,
    async (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      if (!decoded || typeof decoded === 'string') {
        return res.status(403).json({ message: 'Invalid token payload' });
      }

      const payload = decoded as AccessTokenPayload;

      req.userId = payload.userInfo.userId;
      req.username = payload.userInfo.username;
      req.roles = payload.userInfo.roles;
      next();
    }
  );
};
