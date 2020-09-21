import React, { Fragment} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./CartHelper";
import "../style.css";

const isActive = (history, path) => {
    if(history.location.pathname === path){
        return {
            color: "#333"
        };
    } else {
        return {
            color: "#856600"
        };
    }
};

const Menu = ({history}) => {
  return (
      <div>
          <ul className="nav nav-tabs navbar-light bg-light p-2">
              <li className="nav-item">
                  <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
              </li>

              <li className="nav-item">
                  <Link className="nav-link" style={isActive(history, "/shop")} to="/shop">Shop</Link>
              </li>

              <li className="nav-item">
                  <Link
                      className="nav-link"
                      style={isActive(history, "/cart")}
                      to="/cart"
                  >
                      Cart <sup><small className="cart-badge">{itemTotal()}</small></sup>
                  </Link>
              </li>

              {isAuthenticated() && isAuthenticated().user.role === 0 && (
                  <li className="nav-item">
                      <Link className="nav-link" style={isActive(history, "/user/dashboard")} to="/user/dashboard">Dashboard</Link>
                  </li>
              )}

              {isAuthenticated() && isAuthenticated().user.role === 1 && (
              <li className="nav-item">
                  <Link className="nav-link" style={isActive(history, "/admin/dashboard")} to="/admin/dashboard">Dashboard</Link>
              </li>
              )}

              {!isAuthenticated() && (
                  <Fragment>
                      <li>
                          <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Signin</Link>
                      </li>

                      <li>
                          <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Signup</Link>
                      </li>
                  </Fragment>
              )}

              {isAuthenticated() && (
                  <li>
                  <span className="nav-link"
                        style={{cursor: "pointer", color:"#856600"}}
                        onClick={() =>
                            signout(() => {
                                history.push("/");
                            })
                        }>Signout</span>
                  </li>
              )}
          </ul>
      </div>
  )
};

export default withRouter(Menu);
