import { register, login , logout } from "./../controller/user.controller.js";
import { isAuthenticated } from "./../middleware/isAuthenticated.js";
import express from 'express';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(isAuthenticated , logout);

export default router;