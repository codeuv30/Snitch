import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.get('/', (req, res) => {
	res.json({ status: 'ok' });
});

export default app;