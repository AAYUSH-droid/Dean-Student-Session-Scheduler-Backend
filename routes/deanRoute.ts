import express, { Express, Request, Response } from 'express';
const router = express.Router();

import { registerDean, deanLogin } from '../controllers/deanContoller';

router.route('/signup').post(registerDean);
router.route('/login').post(deanLogin);

module.exports = router;
