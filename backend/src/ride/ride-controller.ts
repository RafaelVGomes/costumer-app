import { Request, Response } from 'express';
import { calculateRideEstimate } from './ride-service';

/**
 * Controller to handle ride estimate requests.
 * Validates input, calls the service, and handles errors.
 */
export const calculateEstimate = (req: Request, res: Response): void => {
  const { startLocation, endLocation } = req.body;

  // Validate input data
  if (!startLocation || !endLocation) {
    res.status(400).json({
      error: 'startLocation e endLocation são obrigatórios.',
    });
    return;
  }

  try {
    // Call the service to calculate the ride estimate
    const estimate = calculateRideEstimate(startLocation, endLocation);
    res.status(200).json({ estimate });
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({
      error: 'Ocorreu um erro ao calcular a estimativa.',
    });
  }
};
