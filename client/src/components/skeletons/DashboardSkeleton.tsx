import React from 'react';

const DashboardSkeleton: React.FC = () => {
    return (
        <>
            <div className="grid grid-cols-6 gap-6 p-4 sm:px-4">
                <div className="col-span-3 row-span-2 bg-gradient-to-br from-green-900 to-emerald-800 rounded-2xl p-3 sm:p-6 shadow-xl">
                    <div className="skeleton-dark h-5 w-44 mb-4" />
                    <div className="skeleton-dark h-9 w-32 mb-3" />
                    <div className="skeleton-dark h-4 w-48" />
                </div>

                <div className="col-span-3 row-span-2 bg-gradient-to-br from-green-900 to-emerald-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="skeleton-dark h-5 w-44 mb-4" />
                    <div className="skeleton-dark h-9 w-20 mb-3" />
                    <div className="skeleton-dark h-4 w-48" />
                </div>

                <div className="col-span-6 row-span-2 bg-gradient-to-br from-green-900 to-emerald-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="skeleton-dark h-5 w-36 mb-4" />
                    <div className="flex flex-col items-center">
                        <div className="skeleton-dark h-8 w-40 mb-3" />
                        <div className="skeleton-dark h-4 w-28" />
                    </div>
                </div>
            </div>

            <section className="my-10 sm:px-4">
                <div className="skeleton h-6 w-40 mb-4 ml-4 sm:ml-0" />
                <div className="flex gap-4 overflow-hidden px-4 sm:px-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-green-800/20 p-4 rounded-2xl shadow-sm flex flex-col w-60 flex-shrink-0"
                            style={{ maxWidth: '240px' }}
                        >
                            <div className="skeleton w-full h-28 sm:h-36 rounded-xl mb-3" />
                            <div className="skeleton h-5 w-3/4 mb-2" />
                            <div className="space-y-1.5 mb-3">
                                <div className="skeleton h-3 w-24" />
                                <div className="skeleton h-3 w-20" />
                                <div className="skeleton h-3 w-16" />
                                <div className="skeleton h-3 w-28" />
                            </div>
                            <div className="skeleton h-9 w-full rounded-xl mt-auto" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-10 px-4 sm:px-4 lg:px-4">
                <div className="skeleton h-6 w-44 mb-4" />
                <div className="grid grid-cols-1 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow"
                        >
                            <div className="skeleton h-5 w-20 rounded-full mb-4" />
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                                <div>
                                    <div className="skeleton h-3 w-16 mb-2" />
                                    <div className="skeleton h-5 w-52 mb-2" />
                                    <div className="skeleton h-4 w-36" />
                                </div>
                                <div>
                                    <div className="skeleton h-3 w-16 mb-2" />
                                    <div className="skeleton h-4 w-36" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-4 sm:px-4">
                <div className="skeleton h-6 w-28 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-green-800/20 p-4 rounded-lg shadow"
                        >
                            <div className="bg-green-100 p-6 rounded-lg mb-6 flex flex-col items-center">
                                <div className="skeleton h-5 w-44 mb-3" />
                                <div className="skeleton h-9 w-24" />
                            </div>
                            <div className="skeleton h-4 w-36 mb-3" />
                            <div className="skeleton w-full h-40 rounded" />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default DashboardSkeleton;
