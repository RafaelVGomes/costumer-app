import { getRoute } from '../utils/google-maps-utils';
import { db } from '../database';
import { RouteApiRequest, RouteApiResponse } from 'src/types/interfaces';
import { Driver, DriverCheckInfo, RideEstimateRequest, RideInfo } from 'src/types/interfaces/IRide';
import logger from '../utils/logger';
import { Response } from 'express';

export class RideService {
  // Validação de dados para a estimativa de viagem
  public async ride_estimate_validation(
    form_data: RideEstimateRequest,
    response: Response
  ): Promise<void> {
    if (!form_data.costumer_id) {
      response.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'ID do cliente é obrigatório.',
      });
      return;
    }

    if (!form_data.origin || !form_data.destination) {
      response.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Origem e Destino são obrigatórios.',
      });
      return;
    }

    if (form_data.origin === form_data.destination) {
      response.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Origem e Destino não podem ser iguais.',
      });
      return;
    }
  }

  // Método para calcular a estimativa de uma corrida na API Routes
  public async calculateRideEstimate(
    request: RouteApiRequest
  ): Promise<RouteApiResponse> {
    try {
      // Chamar a API do Google Maps
      const result: RouteApiResponse = await getRoute(request);
      logger.info('Rota obtida com sucesso da API do Google Maps.', {
        result,
      });
      return result;
    } catch (error) {
      logger.error('Erro ao buscar rota da API do Google Maps.', {
        error,
      });
      throw new Error('Falha ao buscar rota da API do Google Maps.');
    }
  }

  // Método para buscar motoristas disponíveis
  public async getAvailableDrivers(distance: number): Promise<Driver[]> {
    try {
      const drivers: Driver[] = await db('drivers')
        .select('*')
        .where('min_distance', '<=', distance)
        .orderBy('rate_per_km', 'asc');

      return drivers;
    } catch (error) {
      logger.error('Erro ao buscar motoristas disponíveis.', { error });
      throw new Error('Erro ao buscar motoristas disponíveis.');
    }
  }

  // Validação de dados para a estimativa de viagem
  public async confirm_ride_validation(
    form_data: RideInfo,
    response: Response
  ): Promise<void> {
    if (!form_data.costumer_id) {
      response.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'ID do cliente é obrigatório.',
      });
      return;
    }

    if (!form_data.origin || !form_data.destination) {
      response.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Origem e Destino são obrigatórios.',
      });
      return;
    }

    if (form_data.origin === form_data.destination) {
      response.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Origem e Destino não podem ser iguais.',
      });
      return;
    }

    const drivers: DriverCheckInfo[] = await db('drivers').select('id', 'name', 'min_distance')
    const driver = drivers.find((driver) => driver.id === form_data.driver.id);
    if (!driver) {
      response.status(404).json({
        error_code: 'DRIVER_NOT_FOUND',
        error_description: 'Motorista não encontrado',
      });
      return;
    }

    if (driver.min_distance < form_data.distance) {
      response.status(406).json({
        error_code: 'INVALID_DISTANCE',
        error_description: 'Quilometragem inválida para o motorista',
      });
      return;
    }
  }
  
  // Método para confirmar a corrida
  public async confirmRideService(form_data: RideInfo): Promise<void> {
    const obj = {
      ...form_data,
      created_at: new Date().toISOString()
    }
    try {
      // Salva as informações da viagem no banco de dados
      await db('rides').insert(obj);
    } catch (error) {
      logger.error('Erro ao confirmar a corrida.', { error });
      throw new Error('Falha ao confirmar a corrida.');
    }
  }
}
