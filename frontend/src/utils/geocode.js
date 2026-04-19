/**
 * Reverse geocodes a latitude and longitude into a readable location string
 * using the free OpenStreetMap Nominatim API.
 */
export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en'
        }
      }
    );
    const data = await res.json();
    if (data && data.address) {
      // Pick the most relevant local area name
      const address = data.address;
      const zoneName = 
        address.village || 
        address.town || 
        address.suburb || 
        address.city_district ||
        address.city || 
        address.county ||
        data.name ||
        'Unknown Zone';
      
      const state = address.state || '';
      
      return state ? `${zoneName}, ${state}` : zoneName;
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
