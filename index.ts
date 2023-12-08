require('dotenv').config();
import express, { Express, Request, Response } from 'express';
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { scheduleSessions } from './controllers/sessionScheduler';

import { studentRoutes } from './routes/studentRoute';
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

scheduleSessions();

//student api
app.use('/api/v1/student', studentRoutes);

app.listen(port, () =>
  console.log(`Server is working on http://localhost:${port}`)
);
