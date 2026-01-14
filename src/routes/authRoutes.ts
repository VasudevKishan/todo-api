import express from 'express';
import loginLimiter from '../middleware/loginLimitter.js';
import {
  login,
  logout,
  refresh,
  whoAmI,
} from '../controllers/authController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = express.Router();

router.route('/').post(loginLimiter, login);

router.route('/refresh').get(refresh);

router.route('/logout').post(logout);

router.route('/me').get(verifyJWT, whoAmI);

export default router;
