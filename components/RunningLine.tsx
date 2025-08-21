"use client";
import { useEffect, useRef } from "react";
import { playfair } from '@/app/fonts/font';

interface RunningLineProps {
  text?: string; // Make text optional
}

const defaultMessages = [
  " Livraison 58 Wilayas",
  " Bienvenue à notre boutique en ligne",
  " Tissu de qualité supérieure",
  " Finitions parfaites",
];

export default function RunningLine({ text }: RunningLineProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  // Use custom text if provided, otherwise use default messages
  const messages = text ? [text] : defaultMessages;

  useEffect(() => {
    const marquee = marqueeRef.current;

    const handleMouseEnter = () => {
      if (marquee) marquee.style.animationPlayState = "paused";
    };

    const handleMouseLeave = () => {
      if (marquee) marquee.style.animationPlayState = "running";
    };

    marquee?.addEventListener("mouseenter", handleMouseEnter);
    marquee?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      marquee?.removeEventListener("mouseenter", handleMouseEnter);
      marquee?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="w-full bg-[#F7E8D7] py-3 hover:bg-opacity-80 overflow-hidden">
      <div className="relative flex w-full">
        {/* Texte qui défile (Original + Clone) */}
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap animate-marquee space-x-16"
        >
          {[...messages, ...messages].map((msg, index) => (
            <span
              key={index}
              className="text-xl font-semibold text-[#7D5A50] flex items-center gap-2"
            >
              {msg}
              {!text && ( // Only show MEERI Store if using default messages
                <p className={`${playfair.className} text-black text-sm px-16 leading-tight tracking-wide drop-shadow-lg`}>
                  MEERI Store
                </p>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Animation en CSS */}
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}