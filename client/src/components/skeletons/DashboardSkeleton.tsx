import React from 'react';

const DashboardSkeleton: React.FC = () => {
    return (
        <>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-4 mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
                        <div className="skeleton h-2.5 w-16 mx-auto mb-3 rounded" />
                        <div className="skeleton h-7 w-20 mx-auto rounded" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:px-4">
                <div className="col-span-1 bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
                    <div className="skeleton-dark h-3 w-32 mb-4 rounded" />
                    <div className="skeleton-dark h-9 w-36 mb-3 rounded" />
                    <div className="skeleton-dark h-3 w-44 rounded" />
                </div>
                <div className="col-span-1 bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
                    <div className="skeleton-dark h-3 w-28 mb-4 rounded" />
                    <div className="skeleton-dark h-9 w-16 mb-3 rounded" />
                    <div className="skeleton-dark h-3 w-44 rounded" />
                </div>
                <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-amber-700 via-orange-700 to-yellow-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
                    <div className="skeleton-dark h-3 w-24 mb-4 rounded" />
                    <div className="skeleton-dark h-8 w-32 mb-3 rounded" />
                    <div className="skeleton-dark h-3 w-28 rounded" />
                </div>
            </div>

            <section className="my-10 sm:px-4">
                <div className="flex items-center justify-between px-4 sm:px-0 mb-4">
                    <div className="skeleton h-6 w-36 rounded" />
                    <div className="skeleton h-10 w-32 rounded-xl" />
                </div>
                <div className="flex gap-4 overflow-hidden px-4 sm:px-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col w-64 flex-shrink-0 overflow-hidden"
                        >
                            <div className="skeleton w-full h-36 sm:h-40" />
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="skeleton h-4 w-24 rounded" />
                                    <div className="skeleton h-5 w-12 rounded" />
                                </div>
                                <div className="flex gap-1.5 mb-3">
                                    <div className="skeleton h-4 w-14 rounded-md" />
                                    <div className="skeleton h-4 w-16 rounded-md" />
                                </div>
                                <div className="space-y-1.5 mb-4">
                                    <div className="skeleton h-3 w-20 rounded" />
                                    <div className="skeleton h-3 w-28 rounded" />
                                </div>
                                <div className="flex gap-2 mt-auto">
                                    <div className="skeleton h-8 flex-1 rounded-lg" />
                                    <div className="skeleton h-8 flex-1 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-10 px-4 sm:px-4 lg:px-4">
                <div className="skeleton h-6 w-40 mb-4 rounded" />
                <div className="flex gap-3 mb-6">
                    <div className="skeleton h-10 w-24 rounded-xl" />
                    <div className="skeleton h-10 w-28 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100"
                        >
                            <div className="skeleton h-5 w-20 rounded-full mb-4 ml-auto" />
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-2">
                                <div>
                                    <div className="skeleton h-3 w-16 mb-2 rounded" />
                                    <div className="skeleton h-5 w-52 mb-2 rounded" />
                                    <div className="skeleton h-4 w-36 rounded" />
                                </div>
                                <div>
                                    <div className="skeleton h-3 w-16 mb-2 rounded" />
                                    <div className="skeleton h-4 w-36 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-4 sm:px-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="skeleton h-6 w-28 rounded" />
                    <div className="skeleton h-10 w-36 rounded-xl" />
                </div>
                <div className="flex gap-2 mb-4">
                    <div className="skeleton h-9 w-20 rounded-xl" />
                    <div className="skeleton h-9 w-20 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl mb-6 flex flex-col items-center">
                                <div className="skeleton h-3 w-36 mb-3 rounded" />
                                <div className="skeleton h-9 w-24 rounded" />
                            </div>
                            <div className="skeleton h-4 w-32 mb-3 rounded" />
                            <div className="skeleton w-full h-40 rounded-lg" />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default DashboardSkeleton;
