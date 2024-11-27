import { getRoute } from '../utils/google-maps-utils';
import { db } from '../database';
import { RouteApiRequest, RouteApiResponse } from 'src/interfaces';
import { Driver } from './types';
import logger from '../utils/logger';

export class RideService {
  // Método para calcular a estimativa de uma corrida
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

  // Método para confirmar a corrida
  public async confirmRideService(
    customerId: string,
    driverId: string,
    distance: number
  ): Promise<{
    id: string;
    customerId: string;
    driverId: string;
    distance: number;
    date: string;
  }> {
    try {
      const ride = {
        id: Math.random().toString(36).substr(2, 9), // Gerar ID temporário
        customerId,
        driverId,
        distance,
        date: new Date().toISOString(),
      };

      // Salvar no banco de dados
      await db('rides').insert(ride);

      return ride;
    } catch (error) {
      logger.error('Erro ao confirmar a corrida.', { error });
      throw new Error('Falha ao confirmar a corrida.');
    }
  }
}
