import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

//register dean
export const registerDean = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new dean in the database
    const newDean = await prisma.dean.create({
      data: {
        universityId: name,
        password: hashedPassword,
      },
    });

    // Create a JWT token
    const token = jwt.sign(
      { universityId: newDean.universityId },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Adjust the expiration time as needed
    );

    // Respond with the universityID and JWT token
    res.json({ universityID: newDean.universityId, token });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
