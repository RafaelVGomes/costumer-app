import { Router } from 'express';
import { RideController } from './ride-controller';
import { RideService } from './ride-service';


const rideService = new RideService()
const rideController = new RideController(rideService)
const rideRouter: Router = Router();

rideRouter.post('/estimate', (req, res) => rideController.calculateEstimate(req, res));
rideRouter.patch('/confirm', (req, res) => rideController.confirmRide(req, res));

export default rideRouter;
