import { Request, Response } from 'express';
import { calculateRideEstimate, confirmRideService } from './ride-service';
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

export const confirmRide = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { customerId, driverId, distance } = req.body;

  // Validar dados de entrada
  if (!customerId || !driverId || !distance) {
    logger.warn('Missing required fields for ride confirmation', {
      body: req.body,
    });
    res.status(400).json({
      error: 'Os campos customerId, driverId e distance são obrigatórios.',
    });
    return;
  }

  try {
    const confirmation = await confirmRideService(
      customerId,
      driverId,
      distance
    );
    logger.info('Ride confirmed successfully', { confirmation });
    res
      .status(200)
      .json({ message: 'Viagem confirmada com sucesso.', confirmation });
  } catch (error) {
    logger.error('Error confirming ride', { error });
    res.status(500).json({ error: 'Ocorreu um erro ao confirmar a viagem.' });
  }
};