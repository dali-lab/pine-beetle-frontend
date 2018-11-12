import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import router from './router';

// DB Setup
// NOTE this is where collection is named/which database we direct app to
const localMongoConnection = 'mongodb://localhost/pb-dev';
const mongoURI = process.env.MONGODB_URI || localMongoConnection;
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want static assets from folder static
app.use(express.static('static'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// prefix API endpoints
app.use('/v1', router);

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
exports.localMongoConnection = localMongoConnection;
exports.mongoURI = mongoURI;
