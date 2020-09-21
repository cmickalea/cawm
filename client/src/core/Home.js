import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";

const Home = () => {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    const loadProductsBySell = () => {
        getProducts("sold").then(data => {
            if(data.error){
                setError(data.error)
            } else {
                setProductsBySell(data)
            }
        })
    }

    const loadProductsByArrival = () => {
        getProducts("createdAt").then(data => {
            if(data.error){
                setError(data.error)
            } else {
                setProductsByArrival(data)
            }
        })
    }

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, [])

    return (
      <div className="col-8 ml-4 mt-4 p-4" style={{backgroundColor: "#856600"}}>
        <h1 style={{fontSize: "100px"}}>STAY C.A.W.M</h1>
        <h4 style={{ fontSize: "50px"}}> Children Always Want More</h4>
      </div>
    )
}

export default Home;
