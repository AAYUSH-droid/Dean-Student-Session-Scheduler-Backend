import express, { Express, Request, Response } from 'express';
const router = express.Router();

import { deanController } from '../controllers/deanContoller';
import { validateDeanToken } from '../auth/verifyToken';

router.route('/signup').post(deanController.register);
router.route('/login').post(deanController.deanLogin);
router.get('/getSessions', validateDeanToken, deanController.getSessionBooking);

export { router as deanRoutes };
