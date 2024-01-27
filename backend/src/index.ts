import http from 'http';
import createError from 'http-errors';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import swaggerUI from 'swagger-ui-express';
import {config, LoadConfig} from './config';
import swaggerJsdoc from 'swagger-jsdoc';

LoadConfig();


const fetchStartup = async () => {
  await mongoose.connect(config.MONGO_URL);
};
fetchStartup().catch(console.error);

const app = express();
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

import {swaggerOptions} from "./web/routes/openapi";

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));

import indexRouter from './web/routes/index';
import routeRouter from './web/routes/routeRouter';
import orderRouter from './web/routes/orderRouter';

app.use('/', indexRouter);
app.use('/routes', routeRouter);
app.use('/orders', orderRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.set('port', config.PORT);

const server = http.createServer(app);
server.on('listening', onListening);
server.listen(config.PORT);

function onListening() {
  const addr = server.address();
  console.log('Listening on ', addr);
}
