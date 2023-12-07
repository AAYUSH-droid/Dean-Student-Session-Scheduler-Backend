require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import express, { Express, Request, Response } from 'express';
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//student api
const studentAPI = require('./routes/authRoutes');
app.use('/api/v1/student', studentAPI);

//dean api
const deanAPI = require('./routes/deanRoute');
app.use('/api/v1/dean', deanAPI);

app.listen(port, () =>
  console.log(`Server is working on http://localhost:${port}`)
);
