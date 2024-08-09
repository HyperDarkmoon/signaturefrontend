import React from 'react';
import RegistrationForm from './RegistrationForm.js';
import Navbar from './Navbar.js';
import useNavbar from './useNavbar.js'; // Ensure correct path

function Dashboard() {
  // Destructure the array returned by useNavbar
  const [showRegistrationForm, handleRegisterClick, handleHomeClick] = useNavbar();

  if (showRegistrationForm) {
    return <RegistrationForm />;
  }

  return (
    <div>
      <Navbar handleHomeClick={handleHomeClick} handleRegisterClick={handleRegisterClick} />
      <div className="container mt-4">
        <br></br>
        <h1>Dashboard</h1>
        {/* Other dashboard content can go here */}
      </div>
    </div>
  );
}

export default Dashboard;
