import React, {useState} from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import { addItem, updateItem, removeItem } from "./CartHelper";
import "./cartCard.module.css";
const CartCard = ({
                  product,
                  showViewProductButton = true,
                  showAddToCartButton = true,
                  cartUpdate = false,
                  showRemoveProductButton = false,
                  setRun = f => f, //default value of function
                  run = undefined
  }) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);

    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`} className="mr-2">
                <button className="btn btn-outline-primary mt-2 mb-2">
                    View Product
                </button>
                </Link>
            )
        )
    }

    const addToCart = () => {
        addItem(product, () => {
            setRedirect(true);
        })
    }

    const shouldRedirect = redirect => {
        if(redirect){
            return <Redirect to="/cart" />
        }
    }

    const showAddToCart = (showAddToCartButton) => {
        return  showAddToCartButton && (
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
                Add to Cart
            </button>
        )
    }

    const showRemoveButton = showRemoveProductButton => {
        return (
            showRemoveProductButton && (
            <button
                onClick={() => {
                    removeItem(product._id)
                    setRun(!run); //run useEffect in parent Cart
                }}
                className="btn btn-outline-danger mt-2 mb-2"
            >
                Remove Product
            </button>
            )
        );
    };

    const handleChange = productId => event => {
        setRun(!run)
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if(event.target.value >= 1){
            updateItem(productId, event.target.value)
        }
    }

    const showCartUpdateOptions = cartUpdate => {
        return cartUpdate &&
            <div>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            Quantity
                        </span>
                    </div>
                    <input
                        type="number"
                        className="form-control"
                        value={ count }
                        onChange={handleChange(product._id)} />
                </div>
            </div>
    }

    return (
      <div class="card mb-4 p-2">
        <div className="row">
          <div class="col-4">
            <ShowImage item={product} url="products" />
            {showViewButton(showViewProductButton)}
          </div>
          <div className="col-md-8 px-3">
            <div className="card-block px-3">
              <p style={{fontFamily:"alata", fontSize: "20px"}}>{product.description.substring(0, 100)}</p>
              <p style={{fontFamily:"alata", fontSize: "20px"}}>${product.price}</p>
              {showAddToCart(showAddToCartButton)}
              {showRemoveButton(showRemoveProductButton)}
              {showCartUpdateOptions(cartUpdate)}
            </div>
          </div>
        </div>
      </div>
    )
}

export default CartCard;
