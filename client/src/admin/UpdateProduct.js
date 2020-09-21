import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import { getProduct, getCategories, updateProduct } from "./apiAdmin";


const UpdateProduct = ({match}) => {
    const { user, token } = isAuthenticated();
    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        categories: [],
        category: "",
        shipping: "",
        quantity: "",
        photo: "",
        loading: false,
        error: "",
        createdProduct: "",
        redirectToProfile: "",
        formData: ""
    })

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

    //load categories and set form data
    const initCategories = () => {
        getCategories().then(data => {
            if(data.error){
                setValues({...values, error: data.error})
            } else {
                setValues({categories: data, formData: new FormData()})
            }
        })
    }

    const init = (productId) => {
      getProduct(productId).then(data => {
        if(data.error){
          setValues({...values, error: data.error})
        } else {
          setValues({
            ...values,
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category._id,
            categories: data.categories,
            shipping: data.shipping,
            quantity: data.quantity,
            formData: new FormData()
          });
          initCategories()
        }
      })
    }



    useEffect(() => {
        init(match.params.productId);
    }, []);

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value)
        setValues({...values, [name]: value});
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: "", loading: true})
        updateProduct(match.params.productId, user._id, token, formData)
            .then(data => {
                if(data.error){
                    setValues({...values, error: data.error})
                } else {
                    setValues({
                        ...values,
                        name: "",
                        description: "",
                        photo:"",
                        price: "",
                        quantity: "",
                        loading: false,
                        error: false,
                        redirectToProfile: true,
                        createdProduct: data.name
                    });
                }
            })
    }

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                <input onChange={handleChange("photo")} type="file" name="photo" accept="image/*" /></label>
            </div>

            <div className="form-group">
                <label className="">Name</label>
                <input onChange={handleChange("name")} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="">Description</label>
                <textarea onChange={handleChange("description")} type="text" className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="">Price</label>
                <input onChange={handleChange("price")} type="number" className="form-control" value={price} />
            </div>

            <div className="form-group">
                <label className="">Category</label>
                <select onChange={handleChange("category")} className="form-control">
                    <option>select</option>
                    {categories &&
                        categories.map((c, i) => (
                        <option key={i} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="">Quantity</label>
                <input onChange={handleChange("quantity")} type="number" className="form-control" value={quantity} />
            </div>

            <div className="form-group">
                <label className="">Shipping</label>
                <select onChange={handleChange("shipping")} className="form-control">
                    <option>select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>

            <button className="btn btn-outline-primary">Update Product</button>

        </form>
    )

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-info" style={{display: createdProduct ? "" : "none"}}>
            <h2>{`${createdProduct}`} is updated!</h2>
        </div>
    )

    const showLoading = () => (
        loading && (
            <div className="alert alert-success">Loading...</div>
        )
    )

    const redirectUser = () => {
      if(redirectToProfile){
        if(!error){
          return <Redirect to="/admin/dashboard" />
        }
      }
    }

    return (
        <Layout title="Add a New Product"
                description={`Hey ${user.name}, let's make a new product`}>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                    {redirectUser()}
                </div>
            </div>

        </Layout>
    )
}

export default UpdateProduct;
