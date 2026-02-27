import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="snap-start bg-white/80 backdrop-blur-sm border border-black/10 rounded-lg p-2 flex flex-col w-48 flex-shrink-0">
            <div className="skeleton w-full h-24 rounded-md mb-2" />
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-4 w-1/3 mb-1" />
            <div className="skeleton h-3 w-1/2 mb-2" />
            <div className="skeleton h-7 w-full rounded mt-auto" />
        </div>
    );
};

export default SkeletonCard;
