import { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
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


const defaultCenter = { lat: 22.9734, lng: 78.6569 };

const NearbyCrops = ({ selectedCoords, onNearbyCropsChange }: NearbyCropsProps) => {
    const [nearbyCrops, setNearbyCrops] = useState<Crop[]>([]);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

    

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
                            
                            {selectedCoords && (
                                <>
                                    <Marker
                                        position={selectedCoords}
                                        icon={{
                                            url: 'https://cdn-icons-png.flaticon.com/512/2302/2302043.png',
                                            scaledSize: new window.google.maps.Size(50, 50),
                                        }}
                                    />

                                </>
                            )}

                         
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

                    
                            {selectedCrop && (
                                <InfoWindow
                                    position={{
                                        lat: selectedCrop.location.latitude,
                                        lng: selectedCrop.location.longitude,
                                    }}
                                    onCloseClick={() => setSelectedCrop(null)}
                                >
                                    <div className="min-w-[220px] bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{selectedCrop.name}</h3>

                                        <p className="text-sm text-gray-700 font-medium mb-2">
                                            ₹{selectedCrop.price} <span className="text-gray-400 font-normal">• {selectedCrop.quantity}</span>
                                        </p>

                                        <div className="flex flex-col gap-1 text-xs">
                                            <div>
                                                <span className="font-semibold text-gray-600">Type:</span>{' '}
                                                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-semibold">
                                                    {selectedCrop.type}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-600">Availability:</span>{' '}
                                                <span className= " font-semibold inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-800 ">
                                                    {selectedCrop.availability}
                                                </span>
                                            </div>
                                        </div>
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
