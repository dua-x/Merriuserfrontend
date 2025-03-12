"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { FeedbackGET } from "@/lib/action";
import { playfair } from "@/app/fonts/font";

const ChevronButton = ({
    direction,
    onClick,
    visible,
}: {
    direction: "left" | "right";
    onClick: () => void;
    visible: boolean;
}) => {
    if (!visible) return null;

    return (
        <button
            onClick={onClick}
            className={`absolute top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-lg shadow-lg 
                transition-transform hover:scale-110 hover:bg-white/30 ${direction === "left" ? "left-4" : "right-4"}`}
        >
            {direction === "left" ? (
                <ChevronLeftIcon className="w-6 h-6 text-white" />
            ) : (
                <ChevronRightIcon className="w-6 h-6 text-white" />
            )}
        </button>
    );
};

interface UserFeedback {
    user: { username: string };
    comment: string;
    rating: number;
}

interface FeedbackData {
    product: { name: string; _id: string };
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
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            const feedbackData = await FeedbackGET();
            if (feedbackData) {
                setFeedbackList(feedbackData);
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

    useEffect(() => {
        const checkScroll = () => {
            if (!containerRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        };

        checkScroll();
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScroll);
            return () => container.removeEventListener("scroll", checkScroll);
        }
    }, [flattenedFeedback]);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const cardWidth = containerRef.current.children[0]?.clientWidth || 250;
            containerRef.current.scrollBy({
                left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
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
        <section className="relative w-full flex flex-col items-center py-10 overflow-hidden">
            <h1 className={`${playfair.className} text-4xl font-bold text-custom-brown drop-shadow-lg text-center`}>
                Vos Avis
            </h1>

            <div className="relative w-full max-w-5xl mt-8">
                <ChevronButton direction="left" onClick={() => scroll("left")} visible={canScrollLeft} />

                <div
                    ref={containerRef}
                    className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-6 px-8 py-6"
                >
                    {flattenedFeedback.map((feedback, index) => (
                        <div
                            key={index}
                            className="snap-center w-80 bg-custom-beige/70 backdrop-blur-lg shadow-xl rounded-xl p-5 flex flex-col 
                            transition-transform hover:scale-105 border border-white/30"
                        >
                            <h2 className="text-lg font-bold text-white">{feedback.productName}</h2>
                            <p className="text-md font-semibold text-gray-200">@{feedback.username}</p>
                            <p className="text-sm italic text-gray-300">{feedback.comment}</p>
                            <p className="text-yellow-400 mt-2">{"⭐".repeat(feedback.rating)}</p>
                        </div>
                    ))}
                </div>

                <ChevronButton direction="right" onClick={() => scroll("right")} visible={canScrollRight} />
            </div>

            <div className="mt-4 flex gap-2">
                {flattenedFeedback.map((_, index) => (
                    <span key={index} className="h-2 w-2 bg-gray-500 rounded-full opacity-50"></span>
                ))}
            </div>

            <div className="mt-4 text-center text-gray-400 text-sm md:hidden animate-pulse">
                Glissez pour voir plus →
            </div>
        </section>
    );
};

export default Feedback;
