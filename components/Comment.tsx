'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import { CircleUserRound } from "lucide-react";
import { handlelog } from "@/lib/action";

const Comment = ({ productid }: { productid: string }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("authtoken");
            if (token) {
                try {
                    const user = await handlelog();
                    setUsername(user.username || "Anonymous");
                } catch (error) {
                    console.error("Error decoding token", error);
                }
            }
        };

        fetchUser();
    }, []);

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!rating || !comment) {
            setError("Please leave a comment and rating before submitting.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem("authtoken");
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/feedbacks/feedbackPOST`,
                {
                    query: `
                    mutation ADDfeedback($input: inputfeedback!) {
                        ADDfeedback(input: $input) {
                            message
                        }
                    }`,
                    variables: {
                        input: {
                            product: productid,
                            userfeedback: {
                                comment: comment,
                                rating: rating,
                            },
                        },
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComment("");
            setRating(0);
        } catch (err: unknown) {
            console.error("Error:", (err as Error).message);
            setError("Failed to submit feedback.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full lg:max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center">
                <CircleUserRound className="text-gray-600 w-8 h-8" />
                <span className="ml-2">{username}</span>
            </h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 relative">
                {/* Comment Box */}
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                />

                {/* Star Rating */}
                <div className="flex gap-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`cursor-pointer transition-colors ${star <= rating ? "text-yellow-500" : "text-gray-300"
                                }`}
                            onClick={() => handleStarClick(star)}
                        />
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="absolute right-0 bottom-[-50px] flex items-center gap-2 bg-custom-beige text-white px-4 py-2 rounded-full shadow-md hover:bg-[#C4A484] transition"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Send"}
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default Comment;
