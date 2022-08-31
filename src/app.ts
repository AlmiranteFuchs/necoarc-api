import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import { router } from "./router";
export class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.server.use(bodyParser.urlencoded({ extended: false }))
    this.server.use(bodyParser.json())
    this.router();
  }

  public router() {
    this.server.use(router);
  }
}
/*  
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
}); */
