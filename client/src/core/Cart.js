import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "./CartHelper";
import CartCard from "./CartCard";
import Checkout from "./Checkout";

const Cart = () => {
    const [ items, setItems] = useState([]);
    const [ run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart())
    }, [run]);

    const showItems = items => {
        return (
            <div>
                {items.map((product, i) => (
                    <CartCard
                        key={i}
                        product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun}
                        run={run}
                    />
                ))}
            </div>
        )
    }

    const emptyCartMessage = () => (
        <h2>Nada . Zilch . Nothing Here Brokey... Go <Link to="/shop">Shop</Link> </h2>
    )

    return (
      <div className="row" style={{width: "100%"}}>
        <div className="col-6">
          <h2 style={{margin: "4% 0 4% 7%"}}>Your cart has {`${items.length}`} items</h2>
        </div>
        <div className="row">
          <div className="col-4" style={{marginLeft: "4%"}}>
            {items.length > 0 ? showItems(items) : emptyCartMessage()}
            </div>
          <div className="col-2" style={{marginLeft: "4%"}}>
            <Checkout products={items}/>
            <hr />
          </div>
        </div>
      </div>
    )
}

export default Cart;
