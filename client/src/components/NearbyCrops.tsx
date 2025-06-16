import { useEffect, useState } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { getDistanceFromLatLonInKm } from '../utils/calcDistance';

type Crop = {
    _id: string;
    name: string;
    type: string;
    price: number;
    regionPincodes: string[];
    image?: string;
    availability: string;
    quantity: string;
    farmer: string;
    location: { latitude: number; longitude: number };
};

type NearbyCropsProps = {
    selectedCoords: { lat: number; lng: number } | null;
    onNearbyCropsChange?: (crops: Crop[]) => void;
};

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

// Default to center of India
const defaultCenter = { lat: 22.9734, lng: 78.6569 };

const NearbyCrops = ({ selectedCoords, onNearbyCropsChange }: NearbyCropsProps) => {
    const [nearbyCrops, setNearbyCrops] = useState<Crop[]>([]);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null); // ✅ Corrected hook placement

    useEffect(() => {
        if (selectedCoords) {
            setMapCenter(selectedCoords);
            fetchNearbyCrops(selectedCoords.lat, selectedCoords.lng);
        }
    }, [selectedCoords]);

    const fetchNearbyCrops = async (lat: number, lng: number) => {
        try {
            const res = await fetch('https://crop-cart-backend.onrender.com/api/crops');
            const allCrops: Crop[] = await res.json();

            const nearby = allCrops.filter((crop) => {
                if (!crop.location) return false;
                const dist = getDistanceFromLatLonInKm(
                    lat,
                    lng,
                    crop.location.latitude,
                    crop.location.longitude
                );
                return dist <= 25;
            });

            setNearbyCrops(nearby);
            onNearbyCropsChange?.(nearby);
        } catch (err) {
            console.error('Failed to fetch crops:', err);
        }
    };

    return (
        <div className="mt-12 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]

 rounded-3xl shadow-xl  overflow-hidden">
                <div className="px-6 pt-6 sm:pt-8 sm:pt-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Crops Near Your Location
                    </h2>
                    <p className="mt-1 text-sm sm:text-base text-white/80">
                        Based on your selected delivery address, we found these nearby crops within a 25km radius.
                    </p>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="overflow-hidden rounded-2xl  shadow-md">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={selectedCoords ? 15 : 4}
                        >
                            {/* Blue dot for user */}
                            {selectedCoords && (
                                <Circle
                                    center={selectedCoords}
                                    radius={30} // 👈 Smaller radius than 90 meters
                                    options={{
                                        strokeColor: '#2563eb',
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        fillColor: '#3b82f6',
                                        fillOpacity: 0.8,
                                        zIndex: 2,
                                    }}
                                />

                            )}

                            {/* Crop markers */}
                            {nearbyCrops.map((crop) => (
                                <Marker
                                    key={crop._id}
                                    position={{
                                        lat: crop.location.latitude,
                                        lng: crop.location.longitude,
                                    }}
                                    icon={{
                                        url: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
                                        scaledSize: new window.google.maps.Size(38, 38),
                                    }}
                                    onClick={() => setSelectedCrop(crop)}
                                />
                            ))}

                            {/* InfoWindow for crop */}
                            {selectedCrop && (
                                <InfoWindow
                                    position={{
                                        lat: selectedCrop.location.latitude,
                                        lng: selectedCrop.location.longitude,
                                    }}
                                    onCloseClick={() => setSelectedCrop(null)}
                                >
                                    <div className="min-w-[180px] text-sm p-2">
                                        <h3 className="text-base font-semibold text-green-800">{selectedCrop.name}</h3>
                                        <p className="text-gray-700 text-xs">
                                            ₹{selectedCrop.price} • {selectedCrop.quantity}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            <span className="font-medium">Type:</span> {selectedCrop.type}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            <span className="font-medium">Availability:</span> {selectedCrop.availability}
                                        </p>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default NearbyCrops;
