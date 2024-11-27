import { Request, Response } from 'express';
import { RideService } from './ride-service';
import { RouteApiRequest, RouteApiResponse } from 'src/interfaces';
import { Driver, RideEstimate } from './types';
import logger from '../utils/logger';

export class RideController {
  private rideService: RideService;

  constructor(rideService: RideService) {
    this.rideService = rideService;
  }

  // Método para calcular a estimativa da corrida
  public async calculateEstimate(req: Request, res: Response): Promise<void> {
    const costumer_id: number = req.body.costumer_id;
    const apiReq: RouteApiRequest = {
      origin: {
        address: req.body.origin.toLowerCase(),
      },
      destination: {
        address: req.body.destination.toLowerCase(),
      },
    };

    // Validar dados de entrada
    if (!costumer_id) {
      res.status(400).json({
        error_code: 'INVALID DATA',
        error_description: 'ID do cliente é obrigatório.',
      });
      return;
    }

    if (!apiReq.origin || !apiReq.destination) {
      res.status(400).json({
        error_code: 'INVALID DATA',
        error_description: 'Origem e Destino são obrigatórios.',
      });
      return;
    }

    if (apiReq.origin === apiReq.destination) {
      res.status(400).json({
        error_code: 'INVALID DATA',
        error_description: 'Origem e Destino não podem ser iguais.',
      });
      return;
    }

    try {
      // Usar o serviço para calcular a estimativa
      const apiData: RouteApiResponse =
        await this.rideService.calculateRideEstimate(apiReq);

      // Buscar motoristas disponíveis
      const drivers: Driver[] = await this.rideService.getAvailableDrivers(
        apiData.distance
      );

      // Construir o objeto de resultado
      const result: RideEstimate<Driver> = {
        ...apiData,
        options: drivers,
      };

      res.status(200).json({ result });
    } catch (error) {
      logger.error('Erro ao calcular a estimativa da corrida.', { error });
      res.status(500).json({
        error: 'Ocorreu um erro ao calcular a estimativa.',
      });
    }
  }

  // Método para confirmar a corrida
  public async confirmRide(req: Request, res: Response): Promise<void> {
    const { customerId, driverId, distance } = req.body;

    // Validar dados de entrada
    if (!customerId || !driverId || !distance) {
      logger.warn('Campos obrigatórios ausentes para confirmação da corrida.', {
        body: req.body,
      });
      res.status(400).json({
        error: 'Os campos customerId, driverId e distance são obrigatórios.',
      });
      return;
    }

    try {
      // Confirmar a corrida usando o serviço
      const confirmation = await this.rideService.confirmRideService(
        customerId,
        driverId,
        distance
      );

      logger.info('Corrida confirmada com sucesso.', { confirmation });
      res
        .status(200)
        .json({ message: 'Viagem confirmada com sucesso.', confirmation });
    } catch (error) {
      logger.error('Erro ao confirmar a corrida.', { error });
      res.status(500).json({ error: 'Ocorreu um erro ao confirmar a viagem.' });
    }
  }
}
