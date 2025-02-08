
import axios from "axios";
import { headers } from "next/headers";

//USER
export const handlelog = async () => {
    try {
        const token = localStorage.getItem('authtoken'); // Retrieve token from local storage

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/users/userGET`,
            {
                query: `
                    query {
                            userGETById {
                                
                                username
                                email

                            }
                            }
                                            `,
            },
            {
                headers: {
                    'Content-Type': 'application/json', // Use 'application/json' for GraphQL queries
                    Authorization: `Bearer ${token}`, // Add token in the Authorization header
                },
            }
        );

        console.log("Response status:", response.status); // Debugging status
        if (!response.data) {
            throw new Error("Failed to fetch user informations");
        }

        const user = response.data.data.userGETById; // Adjust this based on API response structure
        console.log(user);
        return user;
    } catch (error) {
        console.error("Error fetching user informations :", error);
        return error;
    }
}

export const handleUserinfo = async () => {
    try {
        const token = localStorage.getItem('authtoken'); // Retrieve token from local storage

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/users/userGET`,
            {
                query: `
                    query {
                            userGETById {
                                
                                firstname
                                lastname
                                email
                                phonenumber
                                wilaya
                                commune
                                code_postal
                                adresse

                            }
                            }
                                            `,
            },
            {
                headers: {
                    'Content-Type': 'application/json', // Use 'application/json' for GraphQL queries
                    Authorization: `Bearer ${token}`, // Add token in the Authorization header
                },
            }
        );

        console.log("Response status:", response.status); // Debugging status
        if (!response.data) {
            throw new Error("Failed to fetch user informations");
        }

        const user = response.data.data.userGETById; // Adjust this based on API response structure
        console.log(user);
        return user;
    } catch (error) {
        console.error("Error fetching user informations :", error);
        return error;
    }
}

////ORDER
export const Createorder = async () => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}//StoreAPI/orders/orderPOST`,
            {
                query: `
                mutation {
                createOrder(input: {
                    orderitems: [
                    {
                        quantity: 10,
                        product: "676e8ebfd30a64b188a9800b"
                    },
                    {
                        quantity: 5,
                        product: "676e8ebfd30a64b188a9800b"
                    }
                    ],
                    adress: "city 0 log",
                    city: "reghaia",
                    postalcode: "16036",
                    phonenumber: "0770090580"
                }) {
                    user {
                        _id
                        username
                    },
                    orderitems {
                        quantity
                        product
                    },
                    order {
                    _id
                    idorder
                    totalprice
                    quantityOrder
                    adress
                    city
                    postalcode
                    phonenumber
                    status

                    }


                    message
                }
                }
            `
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

    } catch (error) {
        console.error("Error creating order :", error);
        return error;
    }
}
export const getOrdersByUser = async () => {
    try {
        const token = localStorage.getItem('authtoken');

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/orders/orderGET`,
            {
                query: `
                    query {
                            userorderGET {
                            order {
                            _id
                            orderitems {
                                _id
                                quantity
                                product{
                                name
                                productdetail{
                                color
                                sizes{
                                size
                                }
                                }
                                }
                                createdAt
                                updatedAt
                            }
                            adress
                            city
                            postalcode
                            phonenumber
                            status
                            totalprice
                            quantityOrder
                            user{
                                _id
                                username
                            }
                            dateordered
                            createdAt
                            updatedAt
                            }
                            message
                            }
                            }
                `,
            },
            {
                headers: {
                    'Content-Type': 'application/json', // Use 'application/json' for GraphQL queries
                    Authorization: `Bearer ${token}`, // Add token in the Authorization header
                },
            }
        );

        console.log("Response status:", response.status); // Debugging status
        if (!response.data) {
            throw new Error("Failed to fetch Orders");
        }

        const orders = response.data.data.userorderGET; // Adjust this based on API response structure
        console.log(orders);
        return orders;
    } catch (error) {
        console.error("Error fetching products:", error);
        return error;
    }
};

///CART
export const userCart = async () => {
    try {
        const token = localStorage.getItem('authtoken');

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/cartGET`,
            {
                query: `
                    query {
                        cartGETByuser {
                            _id
                            ProductList {
                                Productid {
                                    _id
                                    name
                                    description
                                    Price
                                }
                                quantityselect
                                sum 
                            }
                            userid {
                                username
                                email
                                firstname
                                lastname
                            }
                            total
                        }
                    }
                `
            },
            {
                headers: {
                    'Content-Type': 'application/json', // Use 'application/json' for GraphQL queries
                    Authorization: `Bearer ${token}`, // Add token in the Authorization header
                },
            }
        );

        const result = response.data.data.cartGETByuser;
        return result;


    } catch (error) {
        console.error("Error fetching carts:", error);
        return error;
    }
}
///PRODUCT
export const getSearchedProducts = async (query: string) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/productGET`,
            {
                query: `
                    query{
                        productGETByname(name : "${query}"){
                                            name
                                            description
                                            richDescription
                                            brand
                                            Price
                                            category
                                            CountINStock
                                            rating
                                            IsFeatured
                                            productdetail {
                                                color
                                                sizes {
                                                    size
                                                    stock
                                                }
                        }

    }
}
                `
            },

        );

        const result = response.data.data.productGETByname;
        return result;


    } catch (error) {
        console.error("Error fetching products:", error);
        return error;
    }

}
export const getProducts = async () => {
    try {

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/productGET`,

            {
                query: `
          query {
            productGET {
              _id
              name
              description
              Price
              category
            }
          }
        `,
            }

        );

        console.log("Response status:", response.status); // Debugging status
        if (!response.data) {
            throw new Error("Failed to fetch products");
        }

        const products = response.data.data.productGET; // Adjust this based on API response structure
        console.log(products);
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
export const getProductDetails = async (productId: string) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/productGET`, {
            query: `
                query {
                    productGETById(_id: "${productId}") {
                        name
                        description
                        richDescription
                        brand
                        Price
                        category
                        CountINStock
                        rating
                        IsFeatured
                        productdetail {
                            color
                            sizes {
                                size
                                stock
                            }
                        }
                    }
                }
            `,
        });

        return response.data?.data?.productGETById || null;
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
};



//collection

export const getCollections = async () => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/categories/categoryGET`,
            {
                query: `
            query {
              CategoryGET {
                _id
                name
                description
                icon
                typestore
              }
            }
          `,
            }
        );

        if (!response.data) {
            throw new Error("No data received from server");
        }

        return response.data.data.CategoryGET;
    } catch (error) {
        console.error("Error fetching collections:", error);
        return [];
    }
};


export const getCollectionDetails = async (categoryId: string) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/productGET`, {
            query: `
                query {
                    productGETBycategory(_id: "${categoryId}") {
                        category {
                            name
                            description
                            icon
                        }
                        product {
                            _id
                            name
                            description
                            Price
                            category
                        }
                            message
                    }
                }
            `,
        });
        console.log(response.data.data.productGETBycategory)

        return response.data.data.productGETBycategory || null;
    } catch (error) {
        console.error("Error fetching collection details:", error);
        return null;
    }
};

//WISHLIST
export const getWishListByUser = async () => {
    try {
        const token = localStorage.getItem('authtoken'); // Retrieve token from local storage

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/wishlists/wishlistGET`,
            {
                query: `
                        query{
                            wishlistGETByuser{
                                wishlist{
                                product{
                                    name
                                    description

                                }
                            user{username}}
                            }
                        }
                `,
            },
            {
                headers: {
                    'Content-Type': 'application/json', // Use 'application/json' for GraphQL queries
                    Authorization: `Bearer ${token}`, // Add token in the Authorization header
                },
            }
        );

        console.log("Response status:", response.status); // Debugging status
        if (!response.data) {
            throw new Error("Failed to fetch wishlist");
        }

        const products = response.data?.data?.wishlistGETByuser; // Adjust this based on API response structure
        console.log(products);
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return error;
    }
};
export const deleteProductWishlist = async(productID :string)=>{
    try{
        const token = localStorage.getItem('authtoken'); // Retrieve token from local storage
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/wishlists/wishlistPOST`,
            {
                query: `
                mutation {
                    wishlistdeleteproduct(input: { product: "${productID}" }) {

                    message
                }
                }
                                            `,
            },
            {
                headers: {
                    'Content-Type': 'application/json', // Use 'application/json' for GraphQL queries
                    Authorization: `Bearer ${token}`, // Add token in the Authorization header
                },
            }
        );
        return response.data.data.message

    }catch(error){
        console.error("Error deleting product from wishlist:", error);
        return error;
    }
}