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

dotenv.config();

const store = new MongoDBStore({
  uri: "mongodb://cache:Cache%4001@cache-shard-00-00.pljbw.mongodb.net:27017,cache-shard-00-01.pljbw.mongodb.net:27017,cache-shard-00-02.pljbw.mongodb.net:27017/?ssl=true&replicaSet=atlas-imosgz-shard-0&authSource=admin&retryWrites=true&w=majority",
  collection: 'sessions'
});

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
app.use('/faq', (req, res) => {
  res.render('faq');
});
app.use('/', (req, res) => {
  res.render('mainPage');
});



app.use(errorHandler);

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(error);
    throw error;
  } else {
    console.log(`server listening on PORT ${process.env.PORT}`);
  }
});
