import { Request, Response, RequestHandler } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

interface getAllUsersResBody {
  users: {
    id: string;
    username: string;
    email: string;
  }[];
}

type getAllUsersResponse = getAllUsersResBody | { message: string };
// @desc Get all users
// @desc GET /users
// access Private
const getAllUsers: RequestHandler<
  Record<string, never>, // no params
  getAllUsersResponse, // response body
  Record<string, never>, // no request body
  Record<string, never> // no query params
> = async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users?.length) {
    return res.status(400).json({ message: 'No Users found!' }); // Empty Users DB
  }
  console.log(req.query.sort);

  const formattedUsers = users.map((u) => ({
    id: u._id.toString(),
    username: u.username,
    email: u.email,
  }));

  res.json({ users: formattedUsers });
};

interface createNewUserReqBody {
  username: string;
  email: string;
  password: string;
}
type createNewUserResBody = { message: string };
// @desc Create new user
// @desc POST /users
// access Private
const createNewUser: RequestHandler<
  Record<string, never>, // no params
  createNewUserResBody, // response body
  createNewUserReqBody // request body
> = async (req, res) => {
  const { username, email, password } = req.body;

  // data check
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // duplicate check
  const duplicateUser = await User.findOne({
    $or: [{ email }, { username }],
  })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicateUser) {
    const isEmailDuplicate =
      duplicateUser.email.toLowerCase() === email.toLowerCase();
    const isUsernameDuplicate =
      duplicateUser.username.toLowerCase() === username.toLowerCase();

    if (isEmailDuplicate) {
      return res.status(409).json({ message: 'Email already exists!' });
    }

    if (isUsernameDuplicate) {
      return res.status(409).json({ message: 'Username already exists!' });
    }
  }
  // hash password
  const hashedPwd = await bcrypt.hash(password, 10);
  const userObj = {
    username,
    email,
    password: hashedPwd,
  };
  const createdUser = await User.create(userObj);

  if (createdUser)
    res.status(201).json({ message: `New user ${username} created!` });
  else res.status(400).json({ message: 'Invalid user data received.' });
};

// @desc update user
// @desc PATCH /users
// access Private
const updateUser: RequestHandler = async (req, res) => {};

// @desc delete user
// @desc DELETE /users
// access Private
const deleteUser: RequestHandler = async (req, res) => {};

export { createNewUser, getAllUsers, deleteUser, updateUser };
