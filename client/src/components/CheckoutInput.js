import Autocomplete from 'react-google-autocomplete';

const CheckoutInput =({countryCode,address,setAddress,id})=> {
    const handleAddressLine1Change = (place) => {
        setAddress({
          ...address,
          addressLine1: place,
        });
      }
  return (
    <Autocomplete
      apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
      onPlaceSelected={(place) => {
        handleAddressLine1Change(place);
      }}
      options={{
        types: ["establishment"],
        componentRestrictions: { country: `sg` },
      }}
      placeholder='enter your address'
      id={id}
      className="border border-gray-300 rounded py-2 px-3 w-full text-base"
    />
  );
}

export default CheckoutInput;