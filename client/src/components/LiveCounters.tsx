import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const LiveCounters: React.FC = () => {
  const stats = [
    { label: "Registered Users", value: 1200, suffix: "+" },
    { label: "KGs of Produce Sold", value: 5000, suffix: "+" },
    { label: "Active Farmers", value: 300, suffix: "+" },
    { label: "Cities Served", value: 75, suffix: "+" },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true, 
    threshold: 0.3, // 
  });

  return (
    <section
      className="py-24 px-6 md:px-20 "
      ref={ref}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-4 sm:mb-6">
          Our Impact So Far
        </h2>
        <p className="text-sm sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-14 font-medium sm:font-semibold leading-relaxed">
          Celebrating the growth of our community and the fresh produce we've delivered.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="cursor-pointer group bg-white p-10 rounded-3xl shadow-md hover:shadow-xl hover:bg-green-50 transition duration-500 transform hover:-translate-y-4"
            >
              <div className="text-4xl font-extrabold text-green-800 mb-4 transition-transform duration-500 group-hover:scale-110">
                {inView ? (
                  <CountUp
                    end={stat.value}
                    duration={2}
                    separator=","
                    suffix={stat.suffix}
                  />
                ) : (
                  "0"
                )}
              </div>
              <p className="text-lg font-semibold text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveCounters;
