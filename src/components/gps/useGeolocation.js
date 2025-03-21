import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada');
        return false;
      }
      return true;
    } catch (error) {
      setError('Erro ao solicitar permissão de localização');
      return false;
    }
  };

  async function getCurrentLocation() {
    try {
      setLoading(true);
      const hasPermission = await getLocationPermission();
      if (!hasPermission) return;
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      // Converter coordenadas em endereço
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
      if (addressResponse[0]) {
        const addr = addressResponse[0];
        // const fullAddress = `${addr.street}, ${addr.name}, ${addr.district}, ${addr.subregion}, ${addr.region}-${addr.country}, ${addr.postalCode}`;
        const fullAddress = `${addr.street}, ${addr.name}, ${addr.district}, ${addr.postalCode}`;
        setAddress({
          formatted: fullAddress,
          details: addr
        });
      }
    } catch (error) {
      setError('Erro ao obter localização');
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location, address, error, loading, getCurrentLocation };
};

// Exportar a função getCurrentLocation separadamente
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
