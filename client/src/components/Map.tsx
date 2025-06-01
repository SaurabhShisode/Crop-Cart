import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

// Type definitions
type Crop = {
  name: string;
  sellerAddress: string;
};

type Location = {
  lat: number;
  lng: number;
  name: string;
};

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 20.5937, // Center of India
  lng: 78.9629,
};

const MapComponent: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string, // ✅ Use env variable
  });

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const res = await axios.get('/api/crops'); 
        const crops: Crop[] = res.data;

        const locs = await Promise.all(
          crops.map(async (crop: Crop): Promise<Location | null> => {
            try {
              const geo = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                  crop.sellerAddress
                )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
              );

              const location = geo.data.results[0]?.geometry.location;

              if (location) {
                return { lat: location.lat, lng: location.lng, name: crop.name };
              } else {
                return null;
              }
            } catch (err) {
              console.error('Geocoding error:', err);
              return null;
            }
          })
        );

        const validLocs: Location[] = locs.filter((loc): loc is Location => loc !== null);
        setLocations(validLocs);

        if (validLocs.length > 0) {
          setMapCenter(validLocs[0]); // ✅ Center map on first valid location
        }
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCropData();
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={5}>
      {locations.map((loc, index) => (
        <Marker key={index} position={{ lat: loc.lat, lng: loc.lng }} label={loc.name} />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
