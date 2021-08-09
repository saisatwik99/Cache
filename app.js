import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import mongoDBStore from 'connect-mongodb-session';
import methodOverride from 'method-override';

import MongoDb from './db/db.js';
import routes from './routes/index.js';
import errorHandler from './utils/errorHandler.js';

const app = express();
const MongoDBStore = mongoDBStore(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

dotenv.config();

await MongoDb.connect(process.env.MONGODB_URL);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
  }))

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
