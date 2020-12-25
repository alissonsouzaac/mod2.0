import express from 'express';
import path from 'path';
import youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routes from './routes';
import SentryConfig from './config/sentry';

import './database';

class App {
    constructor() {
    this.server = express();

    Sentry.init(SentryConfig);


    this.middlewares();
    this.routes();
    this.exceptionHandler();
    }

    middlewares(){
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(express.json());
        this.server.use('files',
        express.static(path.resolve(__dirname, '..', 'tmp', 'updaloads'))
        );
    }

    routes(){
        this.server.use(routes);
        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler() {
      this.server.use(async (err, req, res, next) => {
          //Recebendo 4 parametros já fica entendido que é um middleware de tratamento de erro
        const errors = await new youch(err, req).toJSON();

        return res.status(500).json(errors);
      });
    }
}

export default new App().server;
