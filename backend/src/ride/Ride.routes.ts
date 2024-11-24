import { Router } from 'express';
import estimateRouter from './RideService';

const router: Router = Router();

router.use('/estimate', estimateRouter); // Register estimated route

export default router;
