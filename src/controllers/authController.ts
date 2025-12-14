import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config/env.js';
import {
  AccessTokenPayload,
  loginReqType,
  loginResType,
  logoutResType,
  refreshResType,
} from '../types/authTypes.js';

const accessTokenExpiry = '15m';
const refreshTokenExpiry = '1d';

// @desc login
// @desc POST /auth
// access public
const login: RequestHandler<
  Record<string, never>,
  loginResType,
  loginReqType,
  Record<string, never>
> = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: 'Unauthorized' });

  const accessToken = jwt.sign(
    {
      userInfo: {
        userId: foundUser._id,
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenExpiry }
  );
  const refreshToken = jwt.sign(
    {
      userInfo: {
        userId: foundUser._id,
      },
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenExpiry }
  );

  // secure jwt cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

// -----------------------------------------------------------------------------

// @desc refresh
// @desc GET /auth/refresh
// access public
const refresh: RequestHandler<
  Record<string, never>,
  refreshResType,
  Record<string, never>,
  Record<string, never>
> = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    async (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      if (!decoded || typeof decoded === 'string') {
        return res.status(403).json({ message: 'Invalid token payload' });
      }

      const payload = decoded as AccessTokenPayload;

      const foundUser = await User.findById(payload.userInfo.userId).exec();
      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        {
          userInfo: {
            userId: foundUser._id,
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: accessTokenExpiry }
      );
      res.json({ accessToken });
    }
  );
};

// -----------------------------------------------------------------------------

// @desc logout
// @desc POST /auth/refresh
// access public
const logout: RequestHandler<
  Record<string, never>,
  logoutResType,
  Record<string, never>,
  Record<string, never>
> = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies) return res.sendStatus(204);
  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: 'Cookie cleared' });
};

export { login, refresh, logout };
