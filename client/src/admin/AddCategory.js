import React, { useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createCategory} from "./apiAdmin";

const AddCategory = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    //destructure user and token from local storage
    const {user, token} = isAuthenticated();

    const handleChange = (e) => {
        setError("");
        setName(e.target.value);
    }

    const clickSubmit = e => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        //make request to API to create category
        createCategory(user._id, token, {name})
            .then(data => {
                if(data.error){
                    setError(true);
                } else {
                    setError(false);
                    setSuccess(true);
                }
            });
    }

    const showSuccess = () => {
        if(success){
            return <h3 className="text-success">{name} is created</h3>
        }
    }

    const showError = () => {
        if(error){
            return <h3 className="text-danger"> Category name should be unique</h3>
        }
    }

    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to dashboard
            </Link>
        </div>
    )

    const newCategoryForm = () => (
      <form onSubmit={clickSubmit}>
          <div className="form-group">
              <label>Name</label>
              <input type="text"
                     className="form-control"
                     onChange={handleChange}
                     value={name}
                     autoFocus
                     required
              />
          </div>
          <button className="btn btn-outline-primary">Create Category</button>
      </form>
    );

    return (
        <Layout title="Add a New Category"
                description={`Hey ${user.name}, let's make a new category`}>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {showSuccess()}
                    {showError()}
                    {newCategoryForm()}
                </div>
            </div>
            {goBack()}
        </Layout>
    )
}

export default AddCategory;
