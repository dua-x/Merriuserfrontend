import Collections from "./Collections";
import ProductList from "./ProductList";
import Feedback from "./FeedBack";
import Bespoke from "./Bespoke";


export default function Homepage() {
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
