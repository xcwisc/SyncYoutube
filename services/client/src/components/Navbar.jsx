import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = (props) => (
  <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
    <section className="container">
      <div className="navbar-brand">
        <strong className="navbar-item">{props.title}</strong>
        <span
          className="navbar-toggle navbar-burger"
          onClick={() => {
            const toggle = document.querySelector(".navbar-toggle");
            const menu = document.querySelector(".navbar-menu");
            toggle.classList.toggle("is-active");
            menu.classList.toggle("is-active");
          }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </span>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/" className="navbar-item">Home</Link>
          {props.isAuthenticated &&
            <Link to="/status" className="navbar-item">User Status</Link>
          }
          {props.isAuthenticated &&
            <Link to="/join" className="navbar-item">Join Rooms</Link>
          }
        </div>
        <div className="navbar-end">
          {!props.isAuthenticated &&
            <Link to="/register" className="navbar-item">Register</Link>
          }
          {!props.isAuthenticated &&
            <Link to="/login" className="navbar-item">Log In</Link>
          }
          {props.isAuthenticated &&
            <Link to="/logout" className="navbar-item">Log Out</Link>
          }
        </div>
      </div>
    </section>
  </nav>
);

export default Navbar;