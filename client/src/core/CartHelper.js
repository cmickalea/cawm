export const addItem = (item, next) => {
    let cart = [];
    if(typeof window !== "undefined"){
        if(localStorage.getItem("cart")){
            cart = JSON.parse(localStorage.getItem("cart"));
        }
        cart.push({
            ...item,
            count: 1
        })

        // creates new array of cart items and new Set removes the duplicates
        // new Set only allows unique values
        // take the array of product ids and re-map it to return the actual product

        cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
            return cart.find(p => p._id === id);
        })

        localStorage.setItem("cart", JSON.stringify(cart));
        next();
    }
}


export const itemTotal = () => {
    if(typeof window !== "undefined"){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart")).length
        }
    }
    return 0;
}

export const getCart = () => {
    if(typeof window !== "undefined"){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart"));
        }
    }
    return [];
}

export const updateItem = (productId, count) => {
    let cart = [];
    if(typeof window !== "undefined"){
        if(localStorage.getItem("cart")){
            cart = JSON.parse(localStorage.getItem("cart"))
        }

        cart.map((product,i) => {
            if(product._id === productId){
                cart[i].count = count
            }
        })

        localStorage.setItem("cart", JSON.stringify(cart));
    }
}


export const removeItem = (productId) => {
    let cart = [];
    if(typeof window !== "undefined"){
        if(localStorage.getItem("cart")){
            cart = JSON.parse(localStorage.getItem("cart"))
        }

        cart.map((product,i) => {
            if(product._id === productId){
                cart.splice(i, 1)
            }
        })

        localStorage.setItem("cart", JSON.stringify(cart));
    }
    return cart;
}


export const emptyCart = next => {
  if(typeof window !== "undefined"){
    localStorage.removeItem("cart");
    next();
  }
};
