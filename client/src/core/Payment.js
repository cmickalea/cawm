import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51HFkQ0IFcvkXcXgpkNTb2mrV6oL7p298DeISPtu6wpmHneylUGzfHFuULHw0HvQlhEcchgdMxqIMV2pdSs1PKUca00kIW0GfCe");

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
    )
};

export default Payment;
