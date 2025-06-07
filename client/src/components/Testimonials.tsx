import { Fragment } from "react";
import avatarImg1 from "../assets/avatar/memoji-avatar-3.png";
import avatarImg2 from "../assets/avatar/memoji-avatar-4.png";
import avatarImg3 from "../assets/avatar/memoji-avatar-2.png";

const testimonials = [
    {
        name: "Anita Sharma",
        position: "Home Chef",
        text: "Thanks to CropCart, I get fresh veggies directly from farmers. The quality and delivery are amazing!",
        avatar: avatarImg2,
    },
    {
        name: "Ravi Kumar",
        position: "Organic Farmer",
        text: "CropCart helped me reach more customers and sell my produce directly without middlemen. Truly empowering!",
        avatar: avatarImg1,
    },
    {
        name: "Priya Patel",
        position: "Healthy Lifestyle Blogger",
        text: "I love recommending CropCart to my followers. Fresh, local, and eco-friendly produce delivered right to my door.",
        avatar: avatarImg3,
    },
];
const TestimonialsSection = () => {
    return (
        <section className=" py-16 sm:py-24 overflow-hidden">
            <div className="max-w-7xl mx-10 sm:mx-auto px-6 md:px-12 text-center">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-4 sm:mb-6">
                    Voices of Trust
                </h2>
                <p className="text-sm sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-14 font-medium sm:font-semibold leading-relaxed">
                    Hear directly from our farmers and customers how CropCart makes a difference.
                </p>

                <div
                    className="mt-8 overflow-x-clip h-[230px] sm:h-[250px]"
                    style={{
                        maskImage:
                            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    }}
                >
                    <div className="flex animate-slide-left gap-8 pr-8 flex-none hover:[animation-play-state:paused]">
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
