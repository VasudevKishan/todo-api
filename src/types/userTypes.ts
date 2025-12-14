import { UserType } from '../models/User.js';

interface getAllUsersResBody {
  users: UserType[];
}
export type getAllUsersResponse = getAllUsersResBody | { message: string };

// -----------------------------------------------------------------------------

export interface createNewUserReqBody {
  username: string;
  email: string;
  password: string;
}
export type createNewUserResBody = { message: string };

// -----------------------------------------------------------------------------

export interface UpdateUserReqBody {
  id: string;
  username: string;
  email: string;
  password?: string;
  roles: string;
}

export type UpdateUserResBody = { message: string };



// -----------------------------------------------------------------------------

export interface DeleteUserReqBody {
  userId: string;
}

export type DeleteUserResBody = { message: string };
