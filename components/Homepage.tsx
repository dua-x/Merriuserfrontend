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
            {/* Section Bannière */}
            <div className="relative w-full h-[70vh] overflow-hidden">
                {/* Image de fond avec effet de zoom */}
                <Image
                    src="/banner.jpg"
                    alt="Bannière"
                    layout="fill"
                    objectFit="cover"
                    className="scale-105 transition-transform duration-1000 ease-out"
                    priority
                />
                {/* Overlay en dégradé pour un rendu plus doux */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent" />
                
                {/* Contenu du texte centré */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h1 className={`${playfair.className} text-white text-6xl md:text-7xl font-bold 
                                   tracking-wider drop-shadow-2xl animate-fadeInDown`}>
                        MEERI Store
                    </h1>
                    <h2 className="text-3xl md:text-4xl text-white font-semibold mt-4 animate-fadeInUp">
                        Élégance et Qualité pour Chaque Femme
                    </h2>
                    <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-3xl animate-fadeInUp delay-100">
                        Découvrez nos collections exclusives de vêtements qui allient confort, style et modernité.
                    </p>

                    {/* Bouton d’action amélioré */}
                    <Link 
    href="#collections"
    className="mt-8 px-10 py-4 bg-custom-brown text-white text-lg font-semibold rounded-full 
               shadow-lg hover:bg-white hover:text-custom-brown transition-all duration-300 ease-in-out"
>
    DÉCOUVRIR LA COLLECTION
</Link>

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
