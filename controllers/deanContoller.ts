import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { format, isBefore, isAfter } from 'date-fns';

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
  getSessionBooking: async (req: Request, res: Response) => {
    try {
      const currentTime = new Date();
      const allSessions = await prisma.booking.findMany({
        select: {
          BookingId: true,
          studentName: true,
          bookingTime: true,
          sessionId: true,
        },
      });

      const sessionsUTC = allSessions.map((session) => ({
        BookingId: session.BookingId,
        studentName: session.studentName,
        bookingTime: format(
          new Date(session.bookingTime),
          "yyyy-MM-dd'T'HH:mm:ss.SSSX"
        ),
        sessionId: session.sessionId,
      }));

      const pendingSessions = sessionsUTC.filter((session) =>
        // isBefore(new Date(session.bookingTime), currentTime)
        isAfter(new Date(session.bookingTime), currentTime)
      );

      res.json({ pendingSessions });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};
