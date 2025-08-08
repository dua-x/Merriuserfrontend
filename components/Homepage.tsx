import Image from 'next/image';
import Link from 'next/link';
import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";
import Feedback from "@/components/FeedBack";
import Bespoke from "@/components/Bespoke";
import MeeriLogo from "@/components/MeeriLogo";
import { playfair } from '@/app/fonts/font';
import RunningLine from "@/components/RunningLine";

export default function Homepage() {
    return (
        <>
             {/* Enhanced Banner Section */}
            <div className="relative w-full h-[70vh] min-h-[500px] max-h-[900px]overflow-hidden">
                {/* Background Image with better scaling */}
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src="/banner.jpg"
                        alt="Bannière"
                        layout="fill"
                        objectFit="cover"
                        className="object-cover w-full h-full transform scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
                        priority
                        quality={100}
                    />
                </div>
                
                {/* Improved gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
                
                {/* Centered content with better responsive sizing */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                        <h1 className={`${playfair.className} text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight drop-shadow-lg animate-fadeInDown`}>
                            MEERI Store
                        </h1>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-medium mt-2 md:mt-4 animate-fadeInUp">
                            Élégance et Qualité pour Chaque Femme
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium mt-2 md:mt-4 max-w-2xl mx-auto animate-fadeInUp delay-100">
                            Découvrez nos collections exclusives de vêtements qui allient confort, style et modernité.
                        </p>

                        {/* Enhanced CTA button */}
                        <div className="pt-4 md:pt-6 animate-fadeInUp delay-200">
                            <Link 
                                href="#collections"
                                className="inline-block px-8 py-3 md:px-12 md:py-4 bg-custom-brown text-white text-sm md:text-base lg:text-lg font-semibold rounded-full shadow-lg hover:bg-white hover:text-custom-brown transform hover:scale-105 transition-all duration-300 ease-in-out"
                            >
                                DÉCOUVRIR LA COLLECTION
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bande défilante */}
            <RunningLine />

            {/* Section Collections */}
            <div id="collections" className="py-10">
                <Collections />
            </div>

            {/* Message Inspirant */}
            <div className="mx-10 text-center">
                <h2 className={`${playfair.className} text-2xl mt-10 leading-tight
                      font-bold text-custom-brown animate-fadeIn`}>
                    Parce que chaque femme mérite de se sentir belle et confiante,  
                    nous vous offrons des styles uniques et intemporels.
                </h2>
            </div>

            {/* Liste des Produits */}
            <ProductList />

            {/* Section Sur-Mesure */}
            <Bespoke />

            {/* Deuxième bande défilante */}
            <RunningLine />

            {/* Section Feedback */}
            <Feedback />

            {/* Logo Meeri Store */}
            <Link href="/" className="flex justify-center items-center gap-2 m-8 hover:scale-105 transition-transform duration-200">
                <MeeriLogo />
            </Link>
        </>
    );
}
