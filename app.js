import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import MongoDb from './db/db.js';
import routes from './routes/index.js';
import errorHandler from './utils/errorHandler.js';

const app = express();

dotenv.config();

await MongoDb.connect(process.env.MONGODB_URL);

app.use(morgan('dev'));
app.use('/api', routes);

app.use(errorHandler);

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(error);
    throw error;
  } else {
    console.log(`server listening on PORT ${process.env.PORT}`);
  }
});
