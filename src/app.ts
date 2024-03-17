import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import { router } from "./router";
import path from 'path';
export class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.server.use(bodyParser.urlencoded({ extended: false }))
    this.server.use(bodyParser.json())
    this.router();

    this.server.set('view engine', 'ejs');
    this.server.set('views', path.join(__dirname, 'views'));
    this.server.use(express.static(path.join(__dirname, 'public')));
    this.server.use('/leader-line', express.static(__dirname + '/node_modules/leader-line'));

  }

  public router() {
    this.server.use(router);
  }
}
/*  
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
}); */
