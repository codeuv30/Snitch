import "dotenv/config";

console.log({ BACKEND_URL: process.env.BACKEND_URL });

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined in environment variables");
}

if (!process.env.FRONTEND_PRODUCTION_URL) {
  throw new Error(
    "FRONTEND_PRODUCTION_URL is not defined in environment variables",
  );
}

if(!process.env.BACKEND_URL) {
  throw new Error(
    "BACKEND_URL is not defined in environment variables",
  );
}

if (!process.env.FRONTEND_DEVELOPMENT_URL) {
  throw new Error(
    "FRONTEND_DEVELOPMENT_URL is not defined in environment variables",
  );
}

if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_SECRET is not defined in environment variables",
  );
}

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error(
    "IMAGEKIT_PUBLIC_KEY is not defined in environment variables",
  );
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error(
    "IMAGEKIT_PRIVATE_KEY is not defined in environment variables",
  );
}

if (!process.env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error(
    "IMAGEKIT_URL_ENDPOINT is not defined in environment variables",
  );
}

if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("RAYZORPAY_KEY_ID is not defined in environment variables");
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("RAYZORPAY_KEY_ID is not defined in environment variables");
}

const config = {
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_PRODUCTION_URL: process.env.FRONTEND_PRODUCTION_URL,
  FRONTEND_DEVELOPMENT_URL: process.env.FRONTEND_DEVELOPMENT_URL,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  BACKEND_URL: process.env.BACKEND_URL
};

export default config;
