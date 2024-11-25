import { Router } from 'express';
import { calculateEstimate } from './Ride.controller';

const rideRouter: Router = Router();

rideRouter.post('/estimate', calculateEstimate); // Register estimated route

export default rideRouter;
