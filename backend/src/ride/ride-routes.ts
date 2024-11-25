import { Router } from 'express';
import { calculateEstimate } from './ride-controller';

const rideRouter: Router = Router();

rideRouter.post('/estimate', calculateEstimate);

export default rideRouter;
