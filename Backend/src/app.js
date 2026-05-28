import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from "cors";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:3001",
	credentials: true,
}));

app.use("/api/v1/auth", authRouter);

app.get('/', (req, res) => {
	res.json({ status: 'ok' });
});

export default app;