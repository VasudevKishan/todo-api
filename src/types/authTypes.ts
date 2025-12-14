import { JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
  userInfo: {
    userId: string;
    username: string;
    roles: string[];
  };
}

export type loginResType = { accessToken: string } | { message: string };
export type loginReqType = { username: string; password: string };

export type refreshResType = { accessToken: string } | { message: string };

export type logoutResType = { message: string };
