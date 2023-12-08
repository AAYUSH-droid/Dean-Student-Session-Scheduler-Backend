import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const deanController = {
  register: async (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
      const universityId = name;
      const hashedPassword = await bcrypt.hash(password, 10);
      const dean = await prisma.dean.create({
        data: {
          universityId,
          password: hashedPassword,
          name,
        },
      });
      res.json({
        message: 'Account created succesfully',
        universityId: dean.universityId,
      });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  deanLogin: async (req: Request, res: Response) => {
    const { universityId, password } = req.body;
    try {
      const dean = await prisma.dean.findFirst({
        where: {
          universityId: universityId,
        },
      });
      if (dean) {
        const token = uuidv4();
        await prisma.dean.update({
          where: {
            universityId: universityId,
          },
          data: {
            token: token,
          },
        });

        res.json({ message: 'Login succesful', token });
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
  getSessions: async (req: Request, res: Response) => {
    try {
      const currentTime = new Date().toISOString();

      const pendingSessions = await prisma.booking.findMany({
        where: {
          bookingTime: {
            gte: currentTime,
          },
        },
        select: {
          bookingTime: true,
        },
      });

      res.json({ pendingSessions });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};
