import Image from 'next/image';
import Link from 'next/link';
import Collections from "@/app/components/Collections";
import ProductList from "@/app/components/ProductList";
import Feedback from "@/app/components/FeedBack";
import Bespoke from "@/app/components/Bespoke";

export default function homepage() {
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
          <h1 className="text-5xl md:text-7xl font-bold text-custom-white drop-shadow-lg">
            Meeri Store
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
    </>
  );
}
