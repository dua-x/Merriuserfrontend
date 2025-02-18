type CollectionType = {
    _id: string;
    name: string;
    icon: string;
    color: string;
    typestore: string;
    createdAt: string;
    updatedAt: string;
};

type ProductDetailType = {
    color: string;
    sizes: {
        size: number;
        stock: number;
    }[];
};

type ProductType = {
    _id: string;
    name: string;
    description: string;
    richDescription: string;
    images: string[];
    brand: string;
    Price: string;
    category: CollectionType;
    CountINStock: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
    IsFeatured: boolean;
    productdetail: ProductDetailType[];
};

type UserType = {
    id: string;
    username: string;
    wishlist: string[];
    createdAt: string;
    updatedAt: string;
};

type OrderItem = {
    product: ProductType;
    quantity: number;
    size: string;
    color: string;
    priceproduct: number;
};

type OrderType = {
    _id: string;
    orderitems: OrderItem[]; // Corrected from [OrderItem] to OrderItem[]
    adress: string;
    wilaya: string;
    commune: string;
    idorder: string;
    phonenumber: string;
    status: string;
    totalprice: number; // Changed Float to number
    quantityOrder: number; // Changed Int to number
    user: UserType; // Changed User to UserType
    dateordered: string; // Removed String!
    createdAt: string;
    updatedAt: string;
};
