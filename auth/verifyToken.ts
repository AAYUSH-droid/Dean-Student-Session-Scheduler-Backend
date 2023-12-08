import { NextFunction, Response } from 'express';
import { CustomRequest } from '../controllers/studentControllers';
import { PrismaClient } from '@prisma/client';
import { validate } from 'uuid';
const prisma = new PrismaClient();

export const validateStudentToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const student = await prisma.student.findFirst({
      where: {
        token: bearerHeader,
      },
    });

    if (student) {
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

export const validateDeanToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const dean = await prisma.dean.findFirst({
      where: {
        token: bearerHeader,
      },
    });

    if (dean) {
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};
