import { ApiGatewayConfigInterface } from './interfaces/routes.interface';
import fileupload from "express-fileupload";
import express, { Application, NextFunction, Request, Response } from 'express';
import * as colors from 'colors';
import { RequestLog } from './logs.module';

export function ApiGatewayMiddleware(app: Application, config: ApiGatewayConfigInterface) {
  app.set('trust proxy', true);

  config.middlewares.forEach((middleware: any) => {
    app.use(middleware);
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (config.logs) RequestLog(req)
    next()
  })

  app.use(fileupload())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // check if debugger true
  if (config.debug) colors.enable()
}