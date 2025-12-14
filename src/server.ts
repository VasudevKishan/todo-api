import 'dotenv/config';

import express, { Request, Response } from 'express';
import path from 'path';
import { logger, logEvents } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/corsOptions.js';
import { connectDB } from './config/dbConn.js';
import mongoose from 'mongoose';
import rootRouter from './routes/root.js';
import authRouter from './routes/authRoutes.js';
import usersRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import todosRouter from './routes/todosRouter.js';

const __dirname = import.meta.dirname;
const app = express();
const PORT: number = parseInt(process.env.PORT || '3500', 10);

console.log(process.env.NODE_ENV);
console.log('Dirname - ' + __dirname);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', rootRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/myprojects', projectRouter);
app.use('/mytodos', todosRouter);

app.all(/.*/, (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});
