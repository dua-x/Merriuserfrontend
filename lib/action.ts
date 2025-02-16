
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
        const token = localStorage.getItem('authtoken');
        if (!token) {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_IPHOST}//StoreAPI/orders/orderPOST`,
                {
                    query: `
                    mutation {
                    createOrder(input: {
    
                        orderitems: [
                        {
                            quantity: 5,
                            product: "67a9c48ecfa94dc08175d5a1",
                            color :"noir",
                            size :"l"
                        },
                        {
                            quantity: 5,
                            product: "676e8ebfd30a64b188a9800b",
                            color :"noir",
                            size :"l"
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
                        Authorization: `Bearer ${token}`, // Add token in the Authorization header
                    }
                }
            );
            return response.data.data.createOrder;
        } else {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_IPHOST}//StoreAPI/orders/orderPOST`,
                {
                    query: `
                        mutation {
                            createOrderAnonym(input: {
                                firstname :"younes"
                                lastname :"hadli"
                                orderitems: [
                                {
                                    quantity: 10,
                                    product: "67a9c48ecfa94dc08175d5a1",
                                    color :"noir",
                                    size :"l"
                                },
                                {
                                    quantity: 5,
                                    product: "67a9ddef903477c6c14e1cf1",
                                    color :"noir",
                                    size :"l"
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
                        Authorization: `Bearer ${token}`, // Add token in the Authorization header
                    }
                }
            );
            return response.data.data.createOrderAnonym;
        }


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


        const orders = response.data.data.userorderGET; // Adjust this based on API response structure
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return error;
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
              images
              category{
              name}
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
        // console.log(response.data?.data?.productGETById)
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

        console.log("Response status:", response.status); // Debugging status
        if (!response.data) {
            throw new Error("Failed to fetch wishlist");
        }

        const products = response.data?.data?.wishlistGETByuser.wishlist; // Adjust this based on API response structure
        console.log(products);
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