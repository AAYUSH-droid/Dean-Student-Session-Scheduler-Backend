import { NextFunction, Response } from 'express';
import { CustomRequest } from '../controllers/StudentControllers';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const validateStudentToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    try {
      const providedToken = bearerHeader.split(' ')[1];
      const decoded: any = jwt.verify(
        providedToken,
        process.env.JWT_SECRET as string
      );

      if (decoded && decoded.universityId) {
        next();
      } else {
        res.sendStatus(403);
      }
    } catch (error) {
      console.error(error);

      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};
