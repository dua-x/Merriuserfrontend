import Collections from "@/app/components/Collections";
import ProductList from "@/app/components/ProductList";
import Feedback from "@/app/components/FeedBack";
import Bespoke from "@/app/components/Bespoke";

export default function homepage() {
  return (
    <>
      <img src="/banner1.jpg" alt="banner" className="w-full h-[500px] object-cover rounded-xl" />
      <Collections />
      <ProductList />
      <Bespoke />
      {/* <Feedback /> */}
    </>
  );
}
