import { useState } from 'react';

/**
 * Hook that wraps the browser Geolocation API for GPS capture.
 * GPS is always optional — never throws errors.
 */
export function useGps() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return null;
    }
    setLoading(true);
    setError(null);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: parseFloat(position.coords.latitude.toFixed(7)),
            lng: parseFloat(position.coords.longitude.toFixed(7)),
          };
          setLat(coords.lat);
          setLng(coords.lng);
          setLoading(false);
          resolve(coords);
        },
        (err) => {
          setError('Could not get location. Please enable GPS.');
          setLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  return { lat, lng, loading, error, getLocation };
}
