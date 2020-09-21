import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { read } from "./apiCore";
import Card from "./Card";

const Product = (props) => {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);

    const loadSingleProduct = productId => {
        read(productId).then(data => {
            if(data.error){
                setError(data.error);
            } else {
                setProduct(data);
            }
        });
    };

    useEffect(() => {
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, []);

    return (
        <Layout title={product && product.name}
                description={product && product.description }
                className="container-fluid">

            <h2 className="mb-4">Single Product</h2>
            <div className="row">
                {
                    product && product.description && (
                        <Card product={product} showViewProductButton={false} />
                    )
                }
            </div>
        </Layout>
    )
}

export default Product;
