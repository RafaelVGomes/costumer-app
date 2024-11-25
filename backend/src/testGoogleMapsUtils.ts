import { getRoute } from './utils/googleMapsUtils';

async function testGetRoute() {
  const origin = {
    location: {
      latLng: {
        latitude: 37.419734, // Latitude de origem
        longitude: -122.0827784, // Longitude de origem
      },
    },
  };

  const destination = {
    location: {
      latLng: {
        latitude: 37.41767, // Latitude de destino
        longitude: -122.079595, // Longitude de destino
      },
    },
  };

  try {
    const route = await getRoute({ origin, destination });
    console.log('Rota calculada com sucesso:', route);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao calcular a rota:', error.message);
    } else {
      console.error('Erro ao calcular a rota:', error);
    }
  }

}

testGetRoute();
