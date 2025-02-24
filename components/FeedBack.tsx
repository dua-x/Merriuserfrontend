"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { FeedbackGET } from "@/lib/action";

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

interface FlattenedFeedback {
    productName: string;
    productId: string;
    username: string;
    comment: string;
    rating: number;
}

const Feedback = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [feedbackList, setFeedbackList] = useState<FeedbackData[]>([]);
    const [flattenedFeedback, setFlattenedFeedback] = useState<FlattenedFeedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            const feedbackData = await FeedbackGET();
            if (feedbackData) {
                setFeedbackList(feedbackData);
                // Flatten the feedback arrays from all products into one
                const flattened = feedbackData.flatMap((productFeedback: FeedbackData) =>
                    productFeedback.userfeedback.map((feedback: UserFeedback) => ({
                        productName: productFeedback.product.name,
                        productId: productFeedback.product._id,
                        username: feedback.user.username,
                        comment: feedback.comment,
                        rating: feedback.rating,
                    }))
                );

                setFlattenedFeedback(flattened);
            }
            setLoading(false);
        };

        fetchFeedback();
    }, []);

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

    if (flattenedFeedback.length === 0) {
        return <p className="text-gray-500 mt-4">No feedback available yet.</p>;
    }

    return (
        <section className="relative w-full items-center justify-center my-8 text-center">
            <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">Feedback Corner</h1>
            <div className="relative flex items-center justify-center">
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <div
                    ref={containerRef}
                    className="flex overflow-x-auto gap-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth w-full items-center"
                >
                    {flattenedFeedback.map((feedback, index) => (
                        <div
                            key={index}
                            className="snap-center shrink-0 w-[300px] h-[180px] bg-custom-beige text-white p-5 rounded-lg shadow-md flex flex-col "
                        >
                            <h2 className="text-xl font-semibold text-white">
                                {feedback.productName}
                            </h2>
                            <p className="text-lg font-semibold">{feedback.username}</p>
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
        </section>
    );
};

export default Feedback;
