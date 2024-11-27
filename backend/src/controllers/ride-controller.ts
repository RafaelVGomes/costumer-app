import { Request, Response } from 'express';
import { RideService } from '../services/ride-service';
import { RouteApiRequest, RouteApiResponse } from 'src/types/interfaces';
import { Driver, RideEstimateRequest, RideEstimateResponse, RideInfo } from '../types/interfaces';
import logger from '../utils/logger';

export class RideController {
  private rideService: RideService;

  constructor(rideService: RideService) {
    this.rideService = rideService;
  }

  // Método para calcular a estimativa da corrida
  public async calculateEstimate(req: Request, res: Response): Promise<void> {
    const form_data: RideEstimateRequest = {
      costumer_id: req.body.costumer_id,
      origin: req.body.origin.toLowerCase(),
      destination: req.body.destination.toLowerCase()
    }
    
    // Validar dados de entrada
    this.rideService.ride_estimate_validation(form_data, res);
    
    // Objeto de requisição da API Routes
    const apiReq: RouteApiRequest = {
      origin: {
        address: form_data.origin,
      },
      destination: {
        address: form_data.destination,
      },
    };
    
    try {
      // Usar o serviço para calcular a estimativa
      const apiData: RouteApiResponse =
        await this.rideService.calculateRideEstimate(apiReq);

      // Buscar motoristas disponíveis
      const drivers: Driver[] = await this.rideService.getAvailableDrivers(
        apiData.distance
      );

      // Construir o objeto de resultado
      const result: RideEstimateResponse<Driver> = {
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
    const form_data: RideInfo = {
      costumer_id: req.body.costumer_id,
      origin: req.body.origin.toLowerCase(),
      destination: req.body.destination.toLowerCase(),
      distance: req.body.distance,
      duration: req.body.duration,
      driver: {
        id: req.body.driver_id,
        name: req.body.driver_name,
      },
      value: req.body.value,
    };

    // Valida os dados da confirmação da viagem
    this.rideService.confirm_ride_validation(form_data, res)

    try {
      // Confirmar a corrida usando o serviço
      await this.rideService.confirmRideService(form_data);

      logger.info('Corrida confirmada com sucesso.', { form_data });
      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('Erro ao confirmar a corrida.', { error });
      res.status(500).json({ erro: error });
    }
  }
}
