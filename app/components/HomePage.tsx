import Image from "next/image";
import Collections from "./Collections";
import ProductList from "./ProductList";


export default function Homepage() {
    return (
        <>
            <img src="/banner1.jpg" alt="banner" className="w-full h-[500px] object-cover rounded-xl" />
            <Collections />
            <ProductList />
        </>
    );
}
