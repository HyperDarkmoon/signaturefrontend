// Navbar.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar({ handleHomeClick, handleRegisterClick }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <button className="navbar-brand btn btn-link" onClick={handleHomeClick} style={{ padding: 0 }}>
                Dashboard
            </button>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <button className="nav-link btn btn-link" onClick={handleHomeClick}>
                            Home
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="btn btn-primary" onClick={handleRegisterClick}>
                            Register
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
