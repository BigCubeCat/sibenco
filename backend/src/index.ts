import http from 'http';
import createError from 'http-errors';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import swaggerUI from 'swagger-ui-express';
import {config, LoadConfig} from './config';
LoadConfig();

import indexRouter from './routes/index';
import usersRouter from './routes/user/userRouter';
import routeRouter from './routes/route/routeRouter';
import orderRouter from './routes/order/orderRouter';
import swDocument from './utils/openapi';
import {createAdmin} from './service/user.service';

console.log(config.MONGO_URL);
const fetchStartup = async () => {
  await mongoose.connect(config.MONGO_URL);
  await createAdmin();
};
fetchStartup().catch(console.error);

const app = express();
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', indexRouter);
app.use('/routes', routeRouter);
app.use('/users', usersRouter);
app.use('/orders', orderRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument));

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
