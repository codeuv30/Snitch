import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import config from './config/config.js';
import userModel from './models/user.model.js';

const app = express();

/* Essential Middlewares */
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: config.NODE_ENV === "production" ? config.FRONTEND_PRODUCTION_URL : config.FRONTEND_DEVELOPMENT_URL,
	credentials: true,
}));
app.use(setVisitorId);

/* Importing Routers */
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import { setVisitorId } from './middlewares/auth.middleware.js';

/* Using Routers */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);

/* Passport Middleware */
app.use(passport.initialize());

/* Sign in with Google Implementation */
passport.use(new GoogleStrategy({
	clientID: config.GOOGLE_CLIENT_ID,
	clientSecret: config.GOOGLE_CLIENT_SECRET,
	callbackURL: "/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
	try {
		const email = profile.emails[0].value;

		const existingUser = await userModel.findOne({ email });

		if(existingUser) {
			return done(null, {
				user: existingUser,
				isNewUser: false,
			});
		}

		return done(null, {
			googleProfile: profile,
			isNewUser: true,
		})
	} catch (error) {
		done(error, null);
	}
	return done(null, profile);
}));

app.get('/', (req, res) => {
	res.json({ status: 'ok' });
});

export default app;