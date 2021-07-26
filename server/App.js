import express from 'express';
import  dotenv from 'dotenv';
import morgan from 'morgan';
import mongoDb from './db.js';
import router from './router.js';
import bodyParser from 'body-parser';
const app = express();

const errorHandler = (req, res, next) => console.log(`ERROR: URL NOT found`);
dotenv.config();

// await mongoDb.connect(process.env.MONGODB_URL, process.env.MONGODB_NAME);

app.use(morgan('dev'));
app.use('/api', router);
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));

app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log(error);
        throw error;
    } else {
        console.log(`server listening on PORT ${process.env.PORT}`);
    }
})

app.use(errorHandler);