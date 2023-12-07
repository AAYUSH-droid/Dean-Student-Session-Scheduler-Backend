import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface CustomRequest extends Request {
  token?: string;
}

//student sign up
export const studentSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { universityId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // unique token
    const authToken = uuidv4();

    const user = await prisma.student.create({
      data: {
        universityId,
        password: hashedPassword,
        authToken,
      },
    });
    const { universityId: userId, authToken: userAuthToken, createdAt } = user;

    // Create a JWT token
    const accessToken = jwt.sign(
      { universityId: userId, authToken: userAuthToken },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );

    res.json({ universityId: userId, authToken: accessToken, createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//student login
export const studentLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { universityId, password } = req.body;
    const student = await prisma.student.findUnique({
      where: { universityId },
    });
    if (!student) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid universityId or password' });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, student.password);

    if (!passwordMatch) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid universityId or password' });
      return;
    }

    // Generate a new JWT token
    const authToken = jwt.sign(
      { universityId },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );

    // JWT token and any other relevant information
    res.json({
      success: true,
      message: 'Login successful',
      authToken,
      student: {
        // id: student.id, //this is the autoincement id
        universityId: student.universityId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
