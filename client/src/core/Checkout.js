import React, {useState, useEffect} from "react";
import { isAuthenticated } from "../auth";
import {getProducts, getBraintreeClientToken, processPayment, createOrder} from "./apiCore";
import { Link , Redirect} from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import {emptyCart} from "./CartHelper";


const Checkout = ({ products }) => {
    const [data, setData] = useState({
      success: false,
      clientToken: null,
      error: "",
      instance: {},
      address: ""
    });

    const [redirect, setRedirect] = useState(false);

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
      getBraintreeClientToken(userId, token).then(data => {
        if(data.error){
          setData({...data, error: data.error})
        } else {
          setData({ clientToken: data.clientToken})
        }
      })
    };

    useEffect(() => {
      getToken(userId, token);
    }, []);


    const handleAddress = event => {
      setData({...data, address: event.target.value});
    }

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0)
    }

    const showCheckout = () => {
        return  isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
              <button className="bth btn-primary">Sign in to Checkout</button>
            </Link>
        )
    }

    let deliveryAddress = data.address;

    const buy = () => {
      // send nonce(data.instance.requestPaymentMehtod()) to server
      let nonce;
      let getNonce = data.instance
        .requestPaymentMethod()
        .then(data => {
          //console.log(data);
          nonce = data.nonce;
          // nonce is card info, send it to backend as pamentMethod nonce and charge Total
          //console.log("send nonce", nonce, getTotal(products))
          const paymentData = {
            paymentMethodNonce: nonce ,
            amount: getTotal(products)
          }

          processPayment(userId, token, paymentData)
            .then(response => {
              const createOrderData = {
                products: products,
                transaction_id: response.transaction.id,
                amount: response.transaction.amount,
                address: deliveryAddress
              };

              createOrder(userId, token, createOrderData)
                .then(response => {
                  //setData({...data, success: response.success});
                  emptyCart(() => {
                    console.log("Payment was successful. Cart is now empty");
                    setRedirect(true);
                  });
              })
                .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
        }).catch(error => {
          //console.log("dropin error: ", error);
          setData({...data, error: error.message});
        })
    }

    const shouldRedirect = redirect => {
        if(redirect){
            return <Redirect to="/" />
        }
    }

    const showError = error => (
      <div className="alert alert-danger"
      style={{display: error ? "" : "none"}}>
        {error}
      </div>
    );

    const showSuccess = success => (
      <div className="alert alert-info"
          style={{display: success ? "" : "none"}}>
            Thank you for making your purchase!
            {shouldRedirect(redirect)}
      </div>
    );

    const showDropIn = () => (
      <div onBlur={() => setData({...data, error: ""})}>
        {data.clientToken !== null && products.length > 0 ? (
          <div>
            <div className="gorm-group mb-3">
              <label className="text-muted">Delivery address:</label>
              <textarea onChange={handleAddress} className="form-control" value={data.address} placeholder="Type your delivery address here..." />
            </div>
            <DropIn options={{
              authorization: data.clientToken
            }} onInstance={instance => (data.instance = instance)} />
            <button onClick={buy} className="btn btn-success"> Pay </button>
          </div>
        ) : null}
      </div>
    )

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    )
}

export default Checkout;
