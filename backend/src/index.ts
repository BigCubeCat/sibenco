import http from 'http';
import createError from 'http-errors';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import {config, LoadConfig} from './config';

LoadConfig();

mongoose.connect(config.MONGO_URL);

const app = express();
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
