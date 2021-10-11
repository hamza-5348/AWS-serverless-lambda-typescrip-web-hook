
import { Handler, Context } from 'aws-lambda';
import dotenv from 'dotenv';
import path from 'path';
const dotenvPath = path.join(__dirname, '../', `config/.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

import { MailgunController } from './controller/mailgun';
const mailgunController = new MailgunController();

export const processMailGunHook: Handler = (event: any, context: Context) => mailgunController.processMailGunHook(event, context);