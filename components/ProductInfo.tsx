'use client';
import { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";
import { createcarte } from "@/lib/action";
import Gallery from "@/components/Gallery";
import { useRouter } from "next/navigation";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(
    productInfo?.productdetail?.[0]?.color || ""
  );

  // Obtenir les détails pour la couleur sélectionnée
  const selectedColorDetails = productInfo.productdetail.find(
    (detail) => detail.color === selectedColor
  );

  const availableSizes = selectedColorDetails?.sizes || [];
  const [selectedSize, setSelectedSize] = useState<number>(
    availableSizes[0]?.size || 0
  );
  const selectedStock =
    availableSizes.find(({ size }) => size === selectedSize)?.stock || 0;
  const [quantity, setQuantity] = useState<number>(1);

  const handleSizeChange = (size: number, stock: number) => {
    setSelectedSize(size);
    setQuantity(stock > 0 ? 1 : 0);
  };

  // Formater l'affichage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
    }).format(price);
  };

  const productPrice = Number(productInfo.Price);
  const totalPrice = productPrice * quantity;

  const handleBuyNow = () => {
    if (selectedStock === 0) return;
  
    const productData = {
      productId: productInfo._id,
      quantity,
      color: selectedColor,
      size: selectedSize.toString(),
      price: productPrice,
      name: productInfo.name,
      image: productInfo.images[0] || "/placeholder.png"
    };
  
    localStorage.setItem("buyNowProduct", JSON.stringify(productData));
    router.push('/checkouts?mode=buynow');
  };

  const handleAddToCart = async () => {
    if (selectedStock === 0) return;
    const token = localStorage.getItem("authtoken"); // ou utiliser un cookie si stocké là
 
    if (!token) {
      setRequestMessage("Vous devez être connecté pour ajouter des articles à votre panier.");
      return;
    }
    try {
      setLoading(true);
      await createcarte(
        productInfo._id,
        quantity,
        selectedSize.toString(),
        selectedColor
      );
      setRequestMessage("Produit ajouté au panier avec succès !");
    } catch (error) {
      console.error(error);
      setRequestMessage("Échec de l'ajout du produit au panier. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  

  if (!productInfo) {
    return <div className="w-full max-w-7xl mx-auto p-6 text-center">Chargement des détails du produit...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto m-4 p-6 bg-white shadow-lg rounded-2xl border border-gray-200 flex flex-col lg:flex-row gap-10">
      {/* Section gauche - Galerie */}
      <div className="w-full lg:w-2/3 flex flex-col gap-2">
        {/* Nom & Favori (Mobile) */}
        <div className="flex justify-between items-center lg:hidden">
          <p className="text-2xl font-bold text-gray-900">{productInfo.name}</p>
          <HeartFavorite product={productInfo} />
        </div>
        <div className="flex text-gray-500 text-sm">
          <p className="font-semibold text-gray-800">
            {productInfo.category.name || 'Non catégorisé'}
          </p>
        </div>
        <Gallery productImage={productInfo?.images || []} />
      </div>

      {/* Section droite - Détails du produit */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        {/* Nom & Favori (Desktop) */}
        <div className="hidden lg:flex justify-between items-center">
          <p className="text-2xl font-bold text-gray-900">{productInfo.name}</p>
          <HeartFavorite product={productInfo} />
        </div>
        
        <div className="flex gap-2 text-gray-500 text-sm">
          <p className="font-semibold text-gray-800">
            {productInfo.category.name || 'Non catégorisé'}
          </p>
        </div>

        <p className="text-2xl font-bold text-gray-900">{formatPrice(productPrice)}</p>
        <p className="text-gray-600 text-lg">{productInfo.description}</p>

        {/* Couleurs */}
        {productInfo.productdetail?.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-base-medium text-grey-2">Couleurs :</p>
            <div className="flex gap-2 flex-wrap">
              {productInfo.productdetail.map((detail, index) => (
                <button
                  key={index}
                  type="button"
                  className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${
                    selectedColor === detail.color 
                      ? "bg-black text-white" 
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedColor(detail.color);
                    handleSizeChange(
                      detail.sizes[0]?.size || 0, 
                      detail.sizes[0]?.stock || 0
                    );
                  }}
                >
                  {detail.color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tailles */}
        {availableSizes.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-base-medium text-grey-2">Tailles :</p>
            <div className="flex gap-2 flex-wrap">
              {availableSizes.map(({ size, stock }, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={stock === 0}
                  className={`border border-black px-2 py-1 rounded-lg ${
                    selectedSize === size 
                      ? "bg-black text-white" 
                      : "hover:bg-gray-100"
                  } ${
                    stock === 0 
                      ? "cursor-not-allowed opacity-50" 
                      : "cursor-pointer"
                  }`}
                  onClick={() => stock > 0 && handleSizeChange(size, stock)}
                >
                  {size} {stock === 0 && "(En rupture de stock)"}
                </button>
              ))}
            </div>
            {selectedStock > 0 && (
              <p className="text-black text-sm">Stock disponible : {selectedStock}</p>
            )}
            {selectedStock === 0 && (
              <p className="text-red-500 text-sm">Cette taille est en rupture de stock.</p>
            )}
          </div>
        )}

        {/* Sélecteur de quantité */}
        <div className="flex flex-col gap-3">
          <p className="text-gray-600 font-medium">Quantité :</p>
          <div className="flex gap-4 items-center">
            <button 
              type="button"
              disabled={quantity <= 1 || selectedStock === 0}
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <MinusCircle
                className={`transition-all ${
                  quantity <= 1 || selectedStock === 0 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:text-red-500 cursor-pointer"
                }`}
              />
            </button>
            <p className="text-lg font-semibold">{selectedStock > 0 ? quantity : 0}</p>
            <button
              type="button"
              disabled={quantity >= selectedStock || selectedStock === 0}
              onClick={() => quantity < selectedStock && setQuantity(quantity + 1)}
            >
              <PlusCircle
                className={`transition-all ${
                  quantity >= selectedStock || selectedStock === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-green-500 cursor-pointer"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Prix total */}
        <p className="text-2xl font-bold text-gray-900">
          Total : {formatPrice(totalPrice)}
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col gap-3">
          {/* Bouton Ajouter au panier */}
          <button
            type="button"
            disabled={selectedStock === 0 || loading}
            className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
              selectedStock === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-custom-beige text-white hover:bg-[#a27a64]"
            }`}
            onClick={handleAddToCart}
          >
            {loading ? "Ajout en cours..." : 
             selectedStock === 0 ? "En rupture de stock" : "Ajouter au panier"}
          </button>

          {/* Bouton Acheter maintenant */}
          <button
            type="button"
            disabled={selectedStock === 0}
            className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
              selectedStock === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
            onClick={handleBuyNow}
          >
            ACHETER MAINTENANT
          </button>
        </div>

        {requestMessage && (
          <p
            className={`text-center text-sm mt-2 ${
              requestMessage.startsWith("Produit") 
                ? "text-green-600" 
                : "text-red-600"
            }`}
          >
            {requestMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;