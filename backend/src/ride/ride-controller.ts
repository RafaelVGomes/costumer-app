import { Request, Response } from 'express';
import { calculateRideEstimate } from './ride-service';
import logger from '../utils/logger';

/**
 * Controller to handle ride estimate requests.
 * Validates input, calls the service, and handles errors.
 */
export const calculateEstimate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { startLocation, endLocation } = req.body;

  // Validate input data
  if (!startLocation || !endLocation) {
    logger.warn('Request missing startLocation or endLocation', {
      body: req.body,
    });
    res.status(400).json({
      error: 'startLocation e endLocation são obrigatórios.',
    });
    return;
  }

  try {
    // Await the service to calculate the ride estimate
    const estimate = await calculateRideEstimate(startLocation, endLocation);
    logger.info('Ride estimate calculated successfully', { estimate });
    res.status(200).json({ estimate });
  } catch (error) {
    logger.error('Error while calculating ride estimate', { error });
    res.status(500).json({
      error: 'Ocorreu um erro ao calcular a estimativa.',
    });
  }
};
