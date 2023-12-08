import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

export interface CustomRequest extends Request {
  token?: string;
}

export const studentController = {
  register: async (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const student = await prisma.student.create({
        data: {
          universityId: name,
          name,
          password: hashedPassword,
        },
      });

      res.json({ success: true, student });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },
  login: async (req: Request, res: Response) => {
    const { SerialNo, universityId, password } = req.body;
    try {
      //find student
      const student = await prisma.student.findFirst({
        where: {
          sno: SerialNo,
        },
      });
      // console.log(student);

      if (student && student.sno) {
        const token = uuidv4();
        await prisma.student.update({
          where: {
            sno: SerialNo,
          },
          data: {
            token: token,
          },
        });

        res.json({ token });
      }
    } catch (error) {
      res.sendStatus(500);
    }
  },
  //get sessions -- auth route
  getSession: async (req: Request, res: Response) => {
    try {
      const sessions = await prisma.session.findMany();
      res.json({ sessions });
    } catch (error) {
      res.sendStatus(500);
    }
  },

  bookSession: async (req: Request, res: Response) => {
    const { sessionID } = req.body;
    const token = req.headers.authorization;

    try {
      //find student
      const student = await prisma.student.findFirst({
        where: {
          token: token,
        },
      });
      //find session
      const session = await prisma.session.findUnique({
        where: {
          id: sessionID,
        },
      });
      if (session && student?.name) {
        const bookingTime = session.time;
        const bookingID = uuidv4();
        // console.log('booking id', bookingID);

        await prisma.booking.create({
          data: {
            BookingId: bookingID,
            studentName: student.name,
            bookingTime,
            sessionId: sessionID,
          },
        });

        // Delete the booked session
        await prisma.session.delete({
          where: {
            id: sessionID,
          },
        });

        res.json({ bookingID });
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  },
};
