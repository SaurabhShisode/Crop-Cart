import React from 'react';

const OrderSkeleton: React.FC = () => {
    return (
        <div className="relative bg-white rounded-xl p-6 shadow border border-gray-100">
            <div className="skeleton h-5 w-20 rounded-full absolute top-2 right-2" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 mt-4">
                <div>
                    <div className="skeleton h-3 w-16 mb-2" />
                    <div className="skeleton h-5 w-52 mb-2" />
                </div>
                <div className="text-right">
                    <div className="skeleton h-3 w-16 mb-2" />
                    <div className="skeleton h-4 w-36" />
                </div>
            </div>
        </div>
    );
};

export default OrderSkeleton;
