// const { format } = require('date-fns');
// const { v4: uuid } = require('uuid');

// const fs = require('fs');
// const fsPromises = require('fs').promises;
// const path = require('path');

import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { NextFunction, Request, Response } from 'express';

const __dirname = import.meta.dirname;

import fs from 'fs';

const fsPromises = fs.promises;

const logEvents = async (message: string, logFileName: string) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
  // console.log(`${req.method} ${req.path}`);
  next();
};

export { logEvents, logger };
// module.exports = { logEvents, logger };
