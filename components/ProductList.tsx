import ProductCarousel from "./ProductCarousel"; // Client Component
import { getProducts } from "@/lib/action"; // Server function

const ProductList = async () => {
  const products = await getProducts();

  return <ProductCarousel products={products} />; 
};

export default ProductList;
