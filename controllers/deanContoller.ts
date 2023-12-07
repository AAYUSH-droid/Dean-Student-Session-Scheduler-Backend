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
  const { universityId, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new dean in the database
    const newDean = await prisma.dean.create({
      data: {
        universityId: universityId,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { universityId: newDean.universityId },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Respond with the universityID and JWT token
    res.json({ universityID: newDean.universityId, token });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

//dean login
export const deanLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { universityId, password } = req.body;
    const dean = await prisma.dean.findUnique({
      where: { universityId },
    });
    if (!dean) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid universityId or password' });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, dean.password);

    if (!passwordMatch) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid universityId or password' });
      return;
    }

    //new JWT token on login
    const authToken = jwt.sign(
      { universityId },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );

    res.json({
      success: true,
      message: 'Login successful',
      authToken,
      dean: {
        id: dean.id,
        universityId: dean.universityId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
