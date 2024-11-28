import { Router } from 'express';
import { RideController } from 'src/controllers/ride-controller';
import { RideService } from 'src/services/ride-service';

const rideService = new RideService()
const rideController = new RideController(rideService)
const rideRouter: Router = Router();

rideRouter.post('/estimate', (req, res) => rideController.calculateEstimate(req, res));
rideRouter.patch('/confirm', (req, res) => rideController.confirmRide(req, res));
rideRouter.get('/:customer_id',
  (req, res) => rideController.get_rides(req, res)
)

export default rideRouter;
