import { Request, Response } from 'express';
import { calculateRideEstimate } from './ride-service';

export const calculateEstimate = (req: Request, res: Response): void => {
  const { startLocation, endLocation } = req.body;

  if (!startLocation || !endLocation) {
    return;
  }

  const estimate = calculateRideEstimate(startLocation, endLocation);
  res.status(200).json({ estimate });
};
