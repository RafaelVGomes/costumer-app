import { Request, Response } from 'express';
import { RideService, ServiceError } from '../services/ride-service';
import { RouteApiRequest, RouteApiResponse } from 'src/types/interfaces';
import {
  Driver,
  RideEstimateRequest,
  RideEstimateResponse,
  RideInfoRequest,
  Rides,
  RidesDetail
} from 'src/interfaces/IRide';
import logger from '../utils/logger';

export class RideController {
  private rideService: RideService;

  constructor(rideService: RideService) {
    this.rideService = rideService;
  }

  // Método para calcular a estimativa da corrida
  public async calculateEstimate(req: Request, res: Response): Promise<void> {
    const form_data: RideEstimateRequest = {
      customer_id: req.body.customer_id,
      origin: req.body.origin.toLowerCase(),
      destination: req.body.destination.toLowerCase()
    }
    
    // Validar dados de entrada
    this.rideService.ride_estimate_validation(form_data);
    
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

      // Retornando erros capturados do Service
      if (error instanceof ServiceError) {
        res.status(error.statusCode).json({
          error_code: error.error_code,
          error_description: error.error_description
        });
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description:
            'Erro no servidor ao calcular a estimativa da corrida.',
        });
      }
    }
  }

  // Método para confirmar a corrida
  public async confirmRide(req: Request, res: Response): Promise<void> {
    const form_data: RideInfoRequest = {
      customer_id: req.body.customer_id,
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

    try {
      // Valida os dados da confirmação da viagem
      const validatedData = await this.rideService.confirm_ride_validation(form_data)

      // Confirmar a corrida usando o serviço
      await this.rideService.confirm_ride(validatedData);

      logger.info('Corrida confirmada com sucesso.', { validatedData });
      res.status(200).json({ success: true });
    } catch (error) {
      logger.error('Erro ao confirmar a corrida.', { error });
      
      // Retornando erros capturados do Service
      if (error instanceof ServiceError) {
        res.status(error.statusCode).json({
          error_code: error.error_code,
          error_description: error.error_description,
        });
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description: 'Erro no servidor ao confirmar a corrida.',
        });
      }
    }
  }

  public async get_rides(req: Request, res: Response) {
    const customer_id = req.params.customer_id
    const driver_id = req.query.driver_id
    
    try {
      await this.rideService.get_rides_validation(customer_id, driver_id)
      const obj = await this.rideService.get_rides(customer_id, driver_id)
      const rides: Rides<RidesDetail> = {
        customer_id: obj.customer_id,
        rides: obj.rides,
      };
      res.status(200).json(rides);
    } catch (error) {
      logger.error('Erro ao consultar corridas.', { error });

      // Retornando erros capturados do Service
      if (error instanceof ServiceError) {
        res.status(error.statusCode).json({
          error_code: error.error_code,
          error_description: error.error_description,
        });
      } else {
        res.status(500).json({
          error_code: 'UNKNOWN_ERROR',
          error_description: 'Erro no servidor ao consultar corridas.',
        });
      }
    }
  }
}
