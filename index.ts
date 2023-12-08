require('dotenv').config();
import express, { Express, Request, Response } from 'express';
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { scheduleSessions } from './controllers/sessionScheduler';

import { studentRoutes } from './routes/studentRoute';
import { deanRoutes } from './routes/deanRoute';

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

scheduleSessions();

//student api
app.use('/api/v1/student', studentRoutes);
//dean api
app.use('/api/v1/dean', deanRoutes);

app.listen(port, () =>
  console.log(`Server is working on http://localhost:${port}`)
);
