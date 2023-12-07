import express, { Express, Request, Response } from 'express';
const router = express.Router();

import { studentSignup, studentLogin } from '../controllers/StudentControllers';

router.route('/signup').post(studentSignup);
router.route('/login').post(studentLogin);

module.exports = router;
