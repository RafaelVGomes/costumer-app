import express from 'express';
import rideRouter from './ride/RideService';

const app = express();

app.use(express.json());
// Routes
app.use('/ride', rideRouter);

export default app;
