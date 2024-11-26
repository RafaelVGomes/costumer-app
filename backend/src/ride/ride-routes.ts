import { Router } from 'express';
import { calculateEstimate, confirmRide } from './ride-controller';

const rideRouter: Router = Router();

rideRouter.post('/estimate', calculateEstimate);
rideRouter.patch('/confirm', confirmRide);

export default rideRouter;
