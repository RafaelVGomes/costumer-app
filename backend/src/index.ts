import express, { Express } from 'express';
import rideRouter from './ride/RideService';
import dotenv from 'dotenv'

dotenv.config()
const apiKey: string = process.env.GOOGLE_API_KEY || (() => {
  throw new Error(
    'API key for Google Maps is missing. Please add it to the environment variables.'
  );
})();

const app: Express = express();

app.use(express.json());
// Routes
app.use('/ride', rideRouter);

export default app;
