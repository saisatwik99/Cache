import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes/index';

const app = express();

const errorHandler = (req, res, next) => console.log('ERROR: URL NOT found');
dotenv.config();

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
