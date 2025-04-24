/**
 * src/components/gps/useGeolocation.js
 */

import * as Location from 'expo-location';

export async function getCurrentLocationStandalone() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permissão de localização negada');
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    const location = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude
    };

    const addressResponse = await Location.reverseGeocodeAsync(location);
    
    if (addressResponse[0]) {
      const addr = addressResponse[0];
      const fullAddress = `${addr.street}, ${addr.name}, ${addr.district}, ${addr.postalCode}`;
      return {
        location,
        address: {
          formatted: fullAddress,
          details: addr
        }
      };
    }
    throw new Error('Não foi possível obter o endereço');
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    throw error;
  }
}

/**
 * Converte um endereço em coordenadas geográficas
 * @param {string} address Endereço completo
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */

export async function getCoordinatesFromAddress(address) {
  try {
    // Verifica permissões primeiro
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permissão de localização necessária');
    }

    // Geocoding do endereço
    const result = await Location.geocodeAsync(address);

    if (result && result.length > 0) {
      return {
        latitude: result[0].latitude,
        longitude: result[0].longitude
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao converter endereço em coordenadas:', error);
    throw error;
  }
};
