import { Fragment } from "react";

const testimonials = [
    {
        name: "Anita Sharma",
        position: "Home Chef",
        text: "Thanks to CropCart, I get fresh veggies directly from farmers. The quality and delivery are amazing!",
        avatar: "/avatar/memoji-avatar-4.png",
    },
    {
        name: "Ravi Kumar",
        position: "Organic Farmer",
        text: "CropCart helped me reach more customers and sell my produce directly without middlemen. Truly empowering!",
        avatar: "/avatar/memoji-avatar-4.png",
    },
    {
        name: "Priya Patel",
        position: "Healthy Lifestyle Blogger",
        text: "I love recommending CropCart to my followers. Fresh, local, and eco-friendly produce delivered right to my door.",
        avatar: "/avatar/memoji-avatar-4.png",
    },
];

const TestimonialsSection = () => {
    return (
        <section className="py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-6">
                    Voices of Trust
                </h2>
                <p className="text-lg md:text-xl text-green-900 max-w-3xl mx-auto mb-12 font-semibold leading-relaxed">
                    Hear directly from our farmers and customers how CropCart makes a difference.
                </p>

                <div
                    className="mt-8 overflow-x-clip h-[250px]"
                    style={{
                        maskImage:
                            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    }}
                >
                    <div className="flex gap-8 animate-slide-left pr-8 flex-none hover:[animation-play-state:paused]">
                        {[...Array(2)].fill(0).map((_, i) => (
                            <Fragment key={i}>
                                {testimonials.map(({ name, position, text, avatar }) => (
                                    <div
                                        key={name + i}
                                        className="min-w-[300px] max-w-sm bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-default text-left"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <img
                                                src={avatar}
                                                alt={`${name} avatar`}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="text-green-800 font-bold text-lg">{name}</h3>
                                                <p className="text-green-700 text-sm">{position}</p>
                                            </div>
                                        </div>
                                        <p className="text-green-900 font-medium text-md leading-relaxed">
                                            {text}
                                        </p>
                                    </div>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
