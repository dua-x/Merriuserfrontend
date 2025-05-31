'use client';
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { FeedbackByProduct, FeedbackGET } from "@/lib/action";
import { playfair } from "@/app/fonts/font";


interface UserFeedback {
    user: {
        username: string;
    };
    comment: string;
    rating: number;
}

interface FeedbackData {
    product: {
        name: string;
        _id: string;
    };
    userfeedback: UserFeedback[];
}

const ClientReviews = ({ productID }: { productID: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [reviews, setReviews] = useState<FeedbackData | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            if (!productID) return;
            setLoading(true);
            const feedbackData = await FeedbackByProduct(productID);
            if (feedbackData) {
                setReviews(feedbackData); // Set the entire object, not just `userfeedback`
            }
            setLoading(false);
        };
        fetchFeedback();
    }, [productID]);

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

    if (loading) {
        return <p className="text-center text-gray-500">Loading feedback...</p>;
    }

    return (
        <section className="relative w-full items-center justify-center my-8 text-center">
             {reviews?.userfeedback.length === 0 ? (
                <p className="text-gray-500 mt-4">No feedback available yet.</p>
            ) : (
                <>
                    <h1 className={`${playfair.className} text-4xl font-bold text-custom-brown drop-shadow-lg text-center`}>
                                    Vos Avis
                    </h1>
                            
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>

                        <div
                            ref={containerRef}
                            className="flex overflow-x-auto gap-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth 
                            w-full justify-center items-center"
                        >
                            {reviews?.userfeedback?.map((feedback, index) => (
                                <div
                                    key={index}
                                    className="snap-center shrink-0 w-[300px] h-[180px] bg-custom-beige text-white p-5 rounded-lg shadow-md flex flex-col items-center justify-center"
                                >
                                    <p className="text-lg font-semibold">{feedback.user.username}</p>
                                    <p className="text-sm italic">{feedback.comment}</p>
                                    <p className="text-yellow-500">{"⭐".repeat(feedback.rating)}</p>
                                </div>
                            ))}

                        </div>

                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="mt-3 text-center text-gray-500 text-sm md:hidden animate-bounce">
                    Swipe left or right to explore →
                    </div>
                </>
            )}

        
        </section>
    );
};


export default ClientReviews;
