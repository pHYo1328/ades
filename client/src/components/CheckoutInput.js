import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const CheckoutInput = ({ countryCode, address, setAddress, id, isInvalid }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  let addressObj = {
    streetNumber: '',
    route: '',
    neighbourhood: '',
    locality: '',
    admLv1: '',
    admLv2: '',
    postalCode: '',
  };
  useEffect(() => {
    window.initMap = function () {
      // Your initialization logic here
      setScriptLoaded(true);
    };

    const loadScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    if (!window.google) {
      loadScript();
    } else {
      window.initMap();
    }

    // Cleanup function
    return () => {
      window.initMap = null;
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['establishment'],
          componentRestrictions: { country: `${countryCode}` },
          fields: ['formatted_address', 'address_components'],
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (!place || !place.address_components) {
          return;
        }

        const formattedStreetAddress = getFormattedStreetAddress(
          place.address_components
        );

        setAddress({
          ...address,
          addressLine1: formattedStreetAddress,
          postalCode: parseInt(addressObj.postalCode),
        });
      });
    }
  }, [scriptLoaded, countryCode, address, setAddress]);

  const getFormattedStreetAddress = (addressComponents) => {
    for (let i = 0; i < addressComponents.length; i++) {
      if (addressComponents[i].types.includes('street_number')) {
        addressObj.streetNumber = addressComponents[i].long_name;
      }
      if (addressComponents[i].types.includes('route')) {
        addressObj.route = addressComponents[i].long_name;
      }
      if (addressComponents[i].types.includes('neighborhood')) {
        addressObj.neighbourhood = addressComponents[i].long_name;
      }
      if (addressComponents[i].types.includes('locality')) {
        addressObj.locality = addressComponents[i].long_name;
      }
      if (addressComponents[i].types.includes('administrative_area_level_2')) {
        addressObj.admLv2 = addressComponents[i].long_name;
      }
      if (addressComponents[i].types.includes('administrative_area_level_1')) {
        addressObj.admLv1 = addressComponents[i].long_name;
      }
      if (addressComponents[i].types.includes('postal_code')) {
        addressObj.postalCode = addressComponents[i].long_name;
      }
    }

    const components = [
      addressObj.streetNumber,
      addressObj.route,
      addressObj.neighbourhood,
      addressObj.locality,
      addressObj.admLv2,
      addressObj.admLv1,
    ];

    let formattedStreetAddress = '';

    components.forEach((component, index) => {
      if (component) {
        const trimmedComponent = component.trim();
        if (trimmedComponent) {
          formattedStreetAddress +=
            (formattedStreetAddress ? (index === 1 ? ' ' : ', ') : '') +
            trimmedComponent;
        }
      }
    });

    return formattedStreetAddress;
  };

  const handleInputChange = (event) => {
    setAddress({
      ...address,
      addressLine1: event.target.value,
    });
  };
  return (
    <input
      type="text"
      ref={inputRef}
      onChange={handleInputChange}
      value={address.addressLine1}
      placeholder="Enter your address"
      id={id}
      className={`border ${
        isInvalid ? 'border-red-500' : 'border-gray-300'
      } rounded py-2 px-3 w-full text-base`}
    />
  );
};

CheckoutInput.propTypes = {
  countryCode: PropTypes.string.isRequired,
  address: PropTypes.shape({
    addressLine1: PropTypes.string.isRequired,
    // Add other address properties if needed
  }).isRequired,
  setAddress: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  isInvalid: PropTypes.bool.isRequired,
};
export default CheckoutInput;
