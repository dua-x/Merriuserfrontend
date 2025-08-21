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
<div className="relative w-full h-[65vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] min-h-[400px] max-h-[950px] mt-14 overflow-hidden">
  {/* Background Image */}
  <Image
    src="/ban.jpg"
    alt="Bannière MEERI"
    fill
    className="object-center sm:object-right w-full h-full transform scale-110 sm:scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
    priority
    quality={100}
  />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

  {/* Text Section */}
  <div className="absolute inset-0 flex items-start sm:items-center justify-start pt-28 sm:pt-0 px-4 sm:px-8 md:px-12 lg:px-24">
    <div className="text-left max-w-2xl space-y-3 sm:space-y-6 animate-fadeInUp">
      
      {/* Title */}
      <h1
        className={`${playfair.className} text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-xl`}
      >
        MEERI Store
      </h1>

      {/* Subtitle */}
      <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl text-white font-medium tracking-wide">
        Élégance intemporelle
      </h2>

      {/* Mobile Short Description */}
      <p className="block sm:hidden text-sm text-white/80 font-light max-w-xs leading-snug">
        Créations uniques & raffinées.
      </p>

      {/* Full Description sm+ */}
      <p className="hidden sm:block text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-xl leading-relaxed">
        Découvrez des créations uniques qui allient raffinement, confort et authenticité.
      </p>

      {/* CTA Button */}
      <div className="pt-4 sm:pt-6 flex justify-center sm:justify-start">
        <Link
          href="#collections"
          className="px-6 py-2 sm:px-8 sm:py-3 bg-custom-brown text-white text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-lg 
                     hover:bg-white hover:text-custom-brown transform hover:scale-110 active:scale-95 transition-all duration-300"
        >
          ✨ DÉCOUVRIR ✨
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
