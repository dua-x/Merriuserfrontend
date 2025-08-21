"use client";
import React, { useEffect, useState, useRef } from "react";
import { FeedbackGET } from "@/lib/action";
import { playfair } from "@/app/fonts/font";

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
  username: string;
  comment: string;
  rating: number;
}

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<FlattenedFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      const data = await FeedbackGET();
      if (data) {
        const flat = data.flatMap((p: FeedbackData) =>
          p.userfeedback.map((f) => ({
            productName: p.product.name,
            username: f.user.username,
            comment: f.comment,
            rating: f.rating,
          }))
        );
        setFeedbacks(flat);
      }
      setLoading(false);
    };
    fetchFeedback();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement des avis...</p>;
  }

  if (feedbacks.length === 0) {
    return <p className="text-center text-gray-400">Aucun avis disponible.</p>;
  }

  return (
    <section className="w-full py-12 flex flex-col items-center">
      <h1
        className={`${playfair.className} text-3xl md:text-4xl font-bold text-custom-brown mb-8`}
      >
        Vos Avis
      </h1>

      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory p-6 scrollbar-hide w-full max-w-6xl"
      >
        {feedbacks.map((f, i) => (
          <div
            key={i}
            className="snap-center min-w-[280px] max-w-[300px] flex-shrink-0 rounded-2xl bg-white shadow-md border border-gray-100 p-6 hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-custom-brown">{f.productName}</h2>
            <p className="text-sm text-gray-500">@{f.username}</p>
            <p className="mt-3 text-gray-700 italic">“{f.comment}”</p>
            <p className="mt-2 text-yellow-500">
              {"⭐".repeat(f.rating)}{" "}
              <span className="text-gray-400 text-sm">({f.rating}/5)</span>
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-gray-400 text-sm md:hidden animate-pulse">
        Glissez pour voir plus →
      </p>
    </section>
  );
};

export default Feedback;
