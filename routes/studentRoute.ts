import express, { Express, Request, Response } from 'express';
const router = express.Router();

import { studentController } from '../controllers/studentControllers';
import { validateStudentToken } from '../auth/verifyToken';

router.route('/signup').post(studentController.register);
router.route('/login').post(studentController.login);
router.get('/getSession', validateStudentToken, studentController.getSession);
router.post(
  '/bookSession',
  validateStudentToken,
  studentController.bookSession
);

export { router as studentRoutes };
