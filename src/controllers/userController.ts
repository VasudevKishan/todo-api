import { Request, Response, RequestHandler } from 'express';
import User, { UserType } from '../models/User.js';
import bcrypt from 'bcrypt';
import Project from '../models/Project.js';

interface getAllUsersResBody {
  users: UserType[];
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
  // console.log(req.query.sort);

  // const formattedUsers = users.map((u) => ({
  //   _id: u._id,
  //   username: u.username,
  //   email: u.email,
  //   roles: u.roles,
  // }));

  res.json({ users: users });
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

interface UpdateUserReqBody {
  id: string;
  username: string;
  email: string;
  password?: string;
  roles: string;
}

type UpdateUserResBody = { message: string };

// @desc update user
// @desc PATCH /users
// access Private
const updateUser: RequestHandler<
  Record<string, never>,
  UpdateUserResBody,
  UpdateUserReqBody,
  Record<string, never>
> = async (req, res) => {
  const { id, username, email, password, roles } = req.body;

  // check data
  if (!id || !username || !email || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // find user
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: 'User not found!' });
  }

  // check if the new data is duplicate
  // const duplicateUser = await User.findOne({
  //   $or: [{ email }, { username }],
  // })
  //   .collation({ locale: 'en', strength: 2 })
  //   .lean()
  //   .exec();

  // console.log(duplicateUser);
  // if (duplicateUser) {
  //   // if we have a user that is not our user and has same email/username then its a duplicate
  //   const isEmailDuplicate =
  //     duplicateUser.email.toLowerCase() === email.toLowerCase() &&
  //     duplicateUser._id.toString() !== id;
  //   const isUsernameDuplicate =
  //     duplicateUser.username.toLowerCase() === username.toLowerCase() &&
  //     duplicateUser._id.toString() !== id;

  //   if (isEmailDuplicate) {
  //     return res.status(409).json({ message: 'Email already exists!' });
  //   }

  //   if (isUsernameDuplicate) {
  //     return res.status(409).json({ message: 'Username already exists!' });
  //   }
  // }

  // Duplicate username
  const duplicateUsername = await User.findOne({
    username,
  })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  console.log(duplicateUsername);
  if (duplicateUsername) {
    // if we have a user that is not our user and has same email/username then its a duplicate
    const isUsernameDuplicate =
      duplicateUsername.username.toLowerCase() === username.toLowerCase() &&
      duplicateUsername._id.toString() !== id;

    if (isUsernameDuplicate) {
      return res.status(409).json({ message: 'Username already exists!' });
    }
  }

  // Duplicate email
  const duplicateEmail = await User.findOne({
    email,
  })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  console.log(duplicateEmail);
  if (duplicateEmail) {
    // if we have a user that is not our user and has same email/username then its a duplicate
    const isEmailDuplicate =
      duplicateEmail.email.toLowerCase() === email.toLowerCase() &&
      duplicateEmail._id.toString() !== id;

    if (isEmailDuplicate) {
      return res.status(409).json({ message: 'Email already exists!' });
    }
  }

  user.username = username;
  user.email = email;
  user.roles = roles;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} is updated!` });
};

interface DeleteUserReqBody {
  userId: string;
}

type DeleteUserResBody = { message: string };

// @desc delete user
// @desc DELETE /users
// access Private
const deleteUser: RequestHandler<
  Record<string, never>,
  DeleteUserResBody,
  DeleteUserReqBody,
  Record<string, never>
> = async (req, res) => {
  const { userId } = req.body;
  // check if id is passed in response
  if (!userId) {
    return res.status(400).json({ message: 'User ID required!' });
  }

  //TODO: check for notes and projects of this user

  const foundProjects = await Project.find()
    .where('userId')
    .equals(userId)
    .exec();
  if (foundProjects.length !== 0)
    return res.status(400).json({
      message:
        'Delete Todos and Projects under of this user before deleting the user',
    });

  // check if user exist
  const user = await User.findById(userId).exec();
  if (!user) {
    return res.status(400).json({ message: 'User not found!' });
  }

  // delete user
  const result = await User.findByIdAndDelete(userId);
  if (!result) {
    return res.status(500).json({ message: 'Error in deleting the User' });
  }
  res.json({
    message: `User ${result.username} with ID ${result._id} deleted`,
  });
};

export { createNewUser, getAllUsers, deleteUser, updateUser };
