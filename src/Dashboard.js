import React from 'react';
import RegistrationForm from './RegistrationForm.js';
import Navbar from './Navbar.js';
import navBarHook from './UseNavbar.js';

function Dashboard() {
    const { showRegistrationForm, handleRegisterClick, handleHomeClick } = navBarHook();

    if (showRegistrationForm) {
        return <RegistrationForm />;
    }

    return (
        <div>
            <Navbar handleHomeClick={handleHomeClick} handleRegisterClick={handleRegisterClick} />
            <div className="container mt-4">
                <h1>Dashboard</h1>
                {/* Other dashboard content can go here */}
            </div>
        </div>
    );
}

export default Dashboard;
