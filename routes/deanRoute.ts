import express, { Express, Request, Response } from 'express';
const router = express.Router();

import { registerDean } from '../controllers/deanContoller';

router.route('/signup').post(registerDean);

module.exports = router;
