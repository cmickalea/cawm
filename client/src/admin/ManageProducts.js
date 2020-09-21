import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { getProducts, deleteProduct } from "./apiAdmin";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const {user, token} = isAuthenticated();

  const loadProducts = () => {
    getProducts().then(data => {
      if(data.error){
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })
  }

  const destroy = productId => {
    deleteProduct(productId, user._id, token).then(data => {
      if(data.error){
        console.log(data.error)
      } else{
        loadProducts()
      }
    })
  }

  useEffect(() => {
    loadProducts()
  }, []);


  return (
    <Layout title="Manage Products" description="CRUD on Products" className="container-fluid">
      <div className="row">
        <div className="col-12">
        <h2>Total Products: {products.length}</h2>
        <hr/>
          <ul className="list-group">
            {products.map((p, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                <strong>{p.name}</strong>
                <Link to={`/admin/product/update/${p._id}`}>
                  <span className="badge badge-warning badge-pill"> Update </span>
                </Link>
                <span onClick={() => destroy(p._id)} className=" badge badge-danger badge-pill"> Delete </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default ManageProducts;
