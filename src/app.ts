import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { envVars } from './app/config/env';

const app = express();

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1); // external proxy/livelink gulo support/trust korar jonno
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}));

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Digital Wallet Management App!!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;