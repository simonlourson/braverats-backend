import express = require('express');
import dotenv from 'dotenv';
import { Routes } from './routes';

// Create a new express application instance
const app: express.Application = express();

class App
{
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    // initialize configuration
    dotenv.config();
    console.log(process.env.ENV_NAME);

    // Create a new express application instance and add middleware
    this.app = express();
    this.app.use(express.json({limit:'1mb'}));
    this.routePrv.routes(this.app);

  }
}

export default new App().app;