import { getRoute } from '../utils/google-maps-utils';
import { db } from '../database';
import { RouteApiRequest, RouteApiResponse } from 'src/types/interfaces';
import {
  Driver,
  DriverCheckInfo,
  RideEstimateRequest,
  RideInfoRequest,
  RideInfoResponse,
  Rides,
  RidesDetail,
} from 'src/interfaces/IRide';
import logger from '../utils/logger';

export class ServiceError extends Error {
  public statusCode: number;
  public error_code: string;
  public error_description: string;

  constructor(
    error_description: string,
    message: string = 'Campo obrigatório',
    error_code: string = 'INVALID_DATA',
    statusCode: number = 400
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error_code = error_code;
    this.error_description = error_description;
  }
}

export class RideService {
  // Validação de dados para a estimativa de viagem
  public async ride_estimate_validation(
    form_data: RideEstimateRequest
  ): Promise<void> {
    try {
      if (!form_data.customer_id)
        throw new ServiceError('ID do cliente é obrigatório.');

      if (!form_data.origin || !form_data.destination)
        throw new ServiceError('Origem e Destino são obrigatórios.');

      if (form_data.origin === form_data.destination)
        throw new ServiceError('Origem e Destino não podem ser iguais.');
    } catch (error) {
      console.log(
        'Erro na validação dos dados de estimativa da corrida:',
        error
      );

      // Relança o erro personalizado ou cria um genérico
      if (error instanceof ServiceError) throw error;
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
    form_data: RideInfoRequest
  ): Promise<RideInfoResponse> {
    let driver: DriverCheckInfo = {
      id: 0,
      name: '',
      min_distance: 0,
      rate_per_km: 0,
    };

    let validatedData: RideInfoResponse = {
      customer_id: '',
      origin: '',
      destination: '',
      distance: 0,
      duration: '',
      driver_id: 0,
      driver_name: '',
      value: 0,
    };
    try {
      if (!form_data.customer_id)
        throw new ServiceError('ID do cliente é obrigatório.');

      if (!form_data.origin || !form_data.destination)
        throw new ServiceError('Origem e Destino são obrigatórios.');

      if (form_data.origin === form_data.destination)
        throw new ServiceError('Origem e Destino não podem ser iguais.');

      const drivers: DriverCheckInfo[] = await db('drivers').select(
        'id',
        'name',
        'min_distance',
        'rate_per_km'
      );

      let drivers_ids: number[] = [];
      drivers.forEach((d) => {
        drivers_ids.push(d.id);
      });

      if (!drivers_ids.includes(form_data.driver.id)) {
        throw new ServiceError(
          'Motorista não encontrado',
          'Erro na procura por motorista',
          'DRIVER_NOT_FOUND',
          404
        );
      } else {
        const index = drivers.findIndex((d) => form_data.driver.id === d.id);
        if (index !== -1) driver = drivers.splice(index, 1)[0];
      }
      console.log('Driver:', driver);
      if (driver.min_distance >= form_data.distance)
        throw new ServiceError(
          'Quilometragem inválida para o motorista',
          'Erro no atribuição da corrida',
          'INVALID_DISTANCE',
          406
        );

      validatedData = {
        customer_id: form_data.customer_id,
        origin: form_data.origin,
        destination: form_data.destination,
        distance: form_data.distance,
        duration: form_data.duration,
        driver_id: driver.id,
        driver_name: driver.name,
        value: form_data.distance * driver.rate_per_km,
      };
      console.log('valData:', validatedData);
    } catch (error) {
      console.log(
        'Erro na validação dos dados de confirmação da corrida:',
        error
      );

      // Relança o erro personalizado ou cria um genérico
      if (error instanceof ServiceError) throw error;
    }
    return validatedData;
  }

  // Método para confirmar a corrida
  public async confirm_ride(validatedData: RideInfoResponse): Promise<void> {
    try {
      // Salva as informações da viagem no banco de dados
      await db('rides').insert({
        customer_id: validatedData.customer_id,
        origin: validatedData.origin,
        destination: validatedData.destination,
        driver_id: validatedData.driver_id,
        driver_name: validatedData.driver_name,
        distance: validatedData.distance,
        duration: validatedData.duration,
        value: validatedData.value,
      });
    } catch (error) {
      logger.error('Erro ao confirmar a corrida.', { error });
      throw new Error('Falha ao confirmar a corrida.');
    }
  }

  public async get_rides_validation(
    customer_id: any,
    driver_id: any
  ) {
    try {
      if (!customer_id) throw new ServiceError('ID do cliente é obrigatório.');

      const drivers_ids: number[] = await db('drivers').select('id');
      console.log(drivers_ids)
      console.log(driver_id);
      if (driver_id && !drivers_ids.includes(Number(driver_id)))
        throw new ServiceError(
          'Motorista invalido',
          'Problema ao consultar motorista',
          'INVALID_DRIVER'
        );
    } catch (error) {
      console.log('Erro na validação da consulta de corridas:', error);

      // Relança o erro personalizado ou cria um genérico
      if (error instanceof ServiceError) throw error;
    }
  }

  public async get_rides(
    customer_id: any,
    driver_id: any
  ): Promise<Rides<RidesDetail>> {
    let rides_list: Rides<RidesDetail> = {
      customer_id: customer_id,
      rides: [],
    };

    const query = db('rides').where('customer_id', customer_id);

    if (driver_id) {
      query.andWhere('driver_id', driver_id);
    }

    try {
      const rides: RidesDetail[] = await query.orderBy('created_at', 'asc');
      console.log(rides)
      rides_list.rides = rides;
    } catch (error) {
      console.log('Erro na consulta de corridas:', error);
    }

    return rides_list;
  }
}
