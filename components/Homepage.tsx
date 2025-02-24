"use client";
import Image from 'next/image';
import Link from 'next/link';
import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";
import Feedback from "@/components/FeedBack";
import Bespoke from "@/components/Bespoke";
import MeeriLogo from "@/components/MeeriLogo";
import { playfair } from '@/app/fonts/font'; // le fichier de l'étape 1

export default function Homepage() {
    return (
        <>
            <div className="relative w-full h-[90vh]">
                <Image
                    src="/banner.jpg"
                    alt="Banner"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
                    <h1
                        className={`
                     ${playfair.className} 
                     text-white
                     text-5xl 
                     md:text-6xl 
                     leading-tight 
                     tracking-wide
                      drop-shadow-lg
                   `}
                    >
                        MEERI
                        Store
                    </h1>
                    <p className="text-xl md:text-2xl text-custom-white mt-4 drop-shadow-lg">
                        Vêtements élégants pour filles hijabi et non hijabi
                    </p>
                    <Link href="#collections" className="mt-8 px-8 py-3 bg-custom-beige text-custom-brown rounded-full font-semibold hover:bg-custom-brown hover:text-custom-beige transition-colors duration-300">
                        Shop Now
                    </Link>
                </div>
            </div>
            {/* Section Collections avec ancre */}
            <div id="collections">
                <Collections />
            </div>
            <ProductList />
            <Bespoke />
            <Feedback />
            <Link href="/" className="flex justify-center items-center gap-2 m-8 hover:scale-105 transition-transform duration-200">
                <MeeriLogo />
            </Link>
        </>
    );
}
