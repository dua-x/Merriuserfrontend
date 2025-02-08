// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
// import { getFeedbacks } from "@/lib/action"; // Function to fetch feedback data

// const Feedback = () => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [feedbacks, setFeedbacks] = useState<{ id: string; message: string }[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await getFeedbacks();
//                 setFeedbacks(data);
//             } catch (error) {
//                 console.error("Error fetching feedback:", error);
//             }
//         };
//         fetchData();
//     }, []);

//     const scroll = (direction: "left" | "right") => {
//         if (containerRef.current) {
//             const cardWidth = containerRef.current.children[0]?.clientWidth || 250;
//             const gap = 16;
//             containerRef.current.scrollBy({
//                 left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
//                 behavior: "smooth",
//             });
//         }
//     };

//     return (
//         <section className="relative w-full px-5 py-8 text-center">
//             <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">Feedback Corner</h1>

//             {/* Scrollable container */}
//             <div className="relative flex items-center justify-center">
//                 {/* Left Scroll Button */}
//                 <button
//                     onClick={() => scroll("left")}
//                     className="absolute left-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
//                 >
//                     <ChevronLeftIcon className="w-6 h-6" />
//                 </button>

//                 {/* Feedback List */}
//                 <div
//                     ref={containerRef}
//                     className="flex overflow-x-auto gap-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth 
//                     w-full items-center justify-start"
//                 >
//                     {feedbacks.length === 0 ? (
//                         <p className="text-red-500 text-center w-full">No feedback available</p>
//                     ) : (
//                         feedbacks.map((feedback) => (
//                             <div
//                                 key={feedback.id}
//                                 className="snap-center shrink-0 w-[80%] sm:w-[60%] md:w-[40%] lg:w-[25%] xl:w-[20%] 
//                           flex justify-center p-4 bg-[#C4A484] text-white rounded-lg shadow-md"
//                             >
//                                 {feedback.message}
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 {/* Right Scroll Button */}
//                 <button
//                     onClick={() => scroll("right")}
//                     className="absolute right-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
//                 >
//                     <ChevronRightIcon className="w-6 h-6" />
//                 </button>
//             </div>

//             {/* Scroll hint for mobile */}
//             <div className="mt-3 text-center text-gray-500 text-sm md:hidden animate-bounce">
//                 Swipe left or right to explore →
//             </div>
//         </section>
//     );
// };

// export default Feedback;

"use client";

import React, { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Mock feedback data
const mockFeedbacks = [
    { id: "1", name: "John Doe", comment: "Amazing service! Highly recommended." },
    { id: "2", name: "Emily Smith", comment: "Great quality products. Will buy again!" },
    { id: "3", name: "Michael Brown", comment: "Fast shipping and excellent customer support." },
    { id: "4", name: "Sophia Davis", comment: "Absolutely love the designs!" },
    { id: "5", name: "Daniel Wilson", comment: "Smooth shopping experience." },
    { id: "6", name: "Olivia Martinez", comment: "Fantastic craftsmanship, exceeded expectations." },
];

const Feedback = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const cardWidth = containerRef.current.children[0]?.clientWidth || 250;
            const gap = 16;
            containerRef.current.scrollBy({
                left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="relative w-full px-5 py-8 text-center">
            <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">Feedback Corner</h1>

            {/* Scrollable container */}
            <div className="relative flex items-center justify-center">
                {/* Left Scroll Button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                {/* Feedback List */}
                <div
                    ref={containerRef}
                    className="flex overflow-x-auto gap-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth 
                    w-full items-center justify-start"
                >
                    {mockFeedbacks.map((feedback) => (
                        <div
                            key={feedback.id}
                            className="snap-center shrink-0 w-[300px] h-[180px] bg-custom-beige text-white p-5 rounded-lg shadow-md flex flex-col justify-between"
                        >
                            <p className="text-lg font-semibold">{feedback.name}</p>
                            <p className="text-sm italic">{feedback.comment}</p>
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Scroll hint for mobile */}
            <div className="mt-3 text-center text-gray-500 text-sm md:hidden animate-bounce">
                Swipe left or right to explore →
            </div>
        </section>
    );
};

export default Feedback;
