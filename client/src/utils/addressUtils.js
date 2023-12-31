export const validateAddress = async (address, countryCode) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAP_API;
  const encodedAddress = encodeURIComponent(address);
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  if (countryCode) {
    const encodedCountryCode = encodeURIComponent(countryCode);
    url += `&components=country:${encodedCountryCode}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results.every((result) => {
        const locationType = result.geometry.location_type;
        return !(
          locationType === 'ROOFTOP' || locationType === 'RANGE_INTERPOLATED'
        );
      });
    } else {
      // Address is invalid or not found
      return true;
    }
  } catch (error) {
    console.error('Error occurred while validating address:', error);
    return true;
  }
};

export const validatePostalCode = async (postalCode, countryCode) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAP_API;
  const encodedPostalCode = encodeURIComponent(postalCode);
  const encodedCountryCode = encodeURIComponent(countryCode);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${encodedPostalCode}|country:${encodedCountryCode}&key=${apiKey}`;

  try {
    console.log('validatePostalCode is called');
    const response = await fetch(url);
    const data = await response.json();
    if (
      data.status === 'OK' &&
      data.results.length > 0 &&
      data.results[0].address_components.length > 1
    ) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error occurred while validating postal code:', error);
    return true;
  }
};
