import ProductCarousel from "./ProductCarousel";
import { getfeaturedproduct } from "@/lib/action";

export const revalidate = 0;

const ProductList = async () => {
    const featuredProducts = await getfeaturedproduct();
    return <ProductCarousel initialProducts={featuredProducts} />;
};

export default ProductList;