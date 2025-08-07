import axios from "axios";

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

        if (!response.data) {
            throw new Error("Failed to fetch user informations");
        }

        const user = response.data.data.userGETById; // Adjust this based on API response structure
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

        if (!response.data) {
            throw new Error("Failed to fetch user informations");
        }

        const user = response.data.data.userGETById; // Adjust this based on API response structure
        return user;
    } catch (error) {
        console.error("Error fetching user informations :", error);
        return error;
    }
}
/*where is the error?? in getorderbyuser  ana dertha hadi
makntch kyna ou lerreur f si

*/
//okey let me check  win raki tkhdmi  biha??
 
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
                    idorder
                    orderitems {
                    _id
                    quantity
                    product{

                        name
                        images
                        Price
                    }
                    size 
                    color
                    priceproduct
                    createdAt
                    updatedAt
                    }
                    adress
                    wilaya
                    commune
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
        const orders = response.data.data.userorderGET.order;
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return error;
    }
};
export const searchorderbyid = async (id: string) => {
    try { // hadi get function machi post 
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/orders/searchorderbyid/${id}`,
            
          
        );
        
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        
        return response.data.order
    } catch (error) {
        console.error("Error searching order:", error);
        throw error;
    }
};
///CART  updated 
export const createcarte = async (
    productId: string,
    quantity: number,
    size: string,
    color: string
) => {
    try {
        const token = localStorage.getItem("authtoken");
        if (!token) {
            alert("Please log in to add items to your cart.");
            return;
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/cartPOST`,
            {
                query: `
                    mutation {
                        cartcreate(input: {
                            ProductList: {
                                Productid: "${productId}",
                                quantityselect: ${quantity},
                                size: "${size}",
                                color: "${color}"
                            }
                        }) {
                         cart {
                                ProductList {
                                    Productid{
                                        name
                                    }
                                    color
                                    size
                                    quantityselect
                                    sum
                                }
                                userid{
                                    username
                                }
                                total
                            }
                            message
                        }
                    }

                `,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.data.cartcreate;
    } catch (error) {
        console.error("Error adding to cart:", error);
        return error;
    }
};

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
                color 
                size
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
                `,
            },
            {
                headers: {
                    'Content-Type': 'application/json', // Use 'application/json' for GraphQL queries
                    Authorization: `Bearer ${token}`, // Add token in the Authorization header
                },
            }
        );


        const carts = response.data.data.cartGETByuser; // Adjust this based on API response structure
        return carts;
    } catch (error) {
        console.error("Error fetching carts:", error);
        return error;
    }
}
export const DeleteProductFromCart = async (ProductId: string) => {
    try {
        const token = localStorage.getItem('authtoken'); // Retrieve token from local storage
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/cartPOST`,
            {
                query: `
                            mutation {
                                DeleteProductfromcart(input: { Productid: "${ProductId}" }) {
                                    cart {
                                        
                                        ProductList {
                                            Productid {
                                                name
                                            }
                                            quantityselect
                                            sum
                                        }
                                        total
                                    }
                                    message
                                }
                            }
          `,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.data.message
    } catch (error) {
        console.error("Error in deleting   Feedback ")

    }

}
///PRODUCT
export const getSearchedProducts = async (query: string) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/productGET`,
            {
                query: `
                    query {
                        productGETByname(name: "${query}") {
                            _id
                            name
                            description
                            richDescription
                            images
                            brand
                            Price
                            category {
                                name
                            }
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
            }
        );

        const result = response.data.data.productGETByname;
        return result;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}  // hadi trj3lk hado 
/*
   query { featuredproductGET { name description richDescription images brand Price category{
    name
   } CountINStock rating IsFeatured productdetail { color sizes { size stock } } } }
    thbi trj3i ga3 hado raj3iom
*/
export const getfeaturedproduct = async () => {
    try { 

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/productGET`,
            {
                query: `
          query {
            featuredproductGET {
              _id
              name
              description
              Price
              images
              IsFeatured
              category{
              name}
            }
          }
        `,
            }

        );


        if (!response.data) {
            throw new Error("Failed to fetch products");
        }

        const products = response.data.data.featuredproductGET; // Adjust this based on API response structure
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
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
              images
              IsFeatured
              category{
              name}
            }
          }
        `,
            }

        );


        if (!response.data) {
            throw new Error("Failed to fetch products");
        }

        const products = response.data.data.productGET; // Adjust this based on API response structure
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
                        _id
                        name
                        description
                        richDescription
                        brand
                        Price
                        category{
                        _id
                        name}
                        CountINStock
                        rating
                        IsFeatured
                        images
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
                            category{
                            name}
                            images
                        }
                            message
                    }
                }
            `,
        });

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
                                _id
                                name
                                description
                                Price
                                category{
                                name}
                                images


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

        if (!response.data) {
            throw new Error("Failed to fetch wishlist");
        }

        const products = response.data?.data?.wishlistGETByuser.wishlist; // Adjust this based on API response structure
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return error;
    }
};
export const deleteProductWishlist = async (productID: string) => {
    try {
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

    } catch (error) {
        console.error("Error deleting product from wishlist:", error);
        return error;
    }
}

//  Feedback  updated

export const CreateFeedback = async () => {
    try {
        const token = localStorage.getItem('authtoken'); // Retrieve token from local storage
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/feedbacks/feedbackPOST`,
            {
                query: `
            mutation{
                ADDfeedback ( input : {

                
                product:"67a9c48ecfa94dc08175d5a1"
                userfeedback: {    comment:" a GOOD PRODUCT "
                rating : 3}

            } ){
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
    } catch (error) {
        console.error("error in creating  Feedback ")

    }
}

export const FeedbackByProduct = async (productID: string) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/feedbacks/feedbackGET`, {
            query: `
                query {
                    feedbackproductGET(_id: "${productID}") {
                        product {
                            name
                            _id
                        }
                        userfeedback {
                            user {
                                username
                            }
                            comment
                            rating
                        }
                    }
                }
            `,
        });

        return response.data?.data?.feedbackproductGET || null;
    } catch (error) {
        console.error("Error fetching Feedback details:", error);
        return null;
    }
};
export const FeedbackGET = async () => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/feedbacks/feedbackGET`, {
            query: `
                query {
                feedbackGET{
                    product{
                        _id
                        name
                    }
                    userfeedback{
                        user {
                            username
                        }
                        comment
                        rating
                    }
                }
            }
            `,
        });

        return response.data?.data?.feedbackGET || null;
    } catch (error) {
        console.error("Error fetching Feedback details:", error);
        return null;
    }
};

export const Deleteuserfeedback = async (productid: string) => {
    try {
        const token = localStorage.getItem('authtoken'); // Retrieve token from local storage
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/feedbacks/feedbackPOST`,
            {
                query: `
                mutation{
                    DELETEfeedback ( input : {

                    product : "${productid}"

                } ){
                    message
                }

                }                       `,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.data.DELETEfeedback.message
    } catch (error) {
        console.error("Error in deleting   Feedback ")

    }

}


