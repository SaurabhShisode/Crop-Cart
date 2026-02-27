import React from 'react';

const IngredientSkeleton: React.FC = () => {
    return (
        <div className="mt-6 bg-white/70 border border-white/20 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <div className="skeleton h-6 w-48 mb-5" />
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="skeleton w-5 h-5 rounded" />
                            <div className="flex flex-col gap-1">
                                <div className="skeleton h-4 w-28" />
                                <div className="skeleton h-3 w-16" />
                            </div>
                        </div>
                        <div className="skeleton h-4 w-10" />
                    </div>
                ))}
            </div>
            <div className="skeleton h-12 w-full rounded-xl mt-6" />
        </div>
    );
};

export default IngredientSkeleton;
