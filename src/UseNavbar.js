// useNavBar.js
import { useState } from 'react';

function useNavbar() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleRegisterClick = () => {
    setShowRegistrationForm(true);
  };

  const handleHomeClick = () => {
    setShowRegistrationForm(false);
  };

  // Return an array with the state and handlers
  return [showRegistrationForm, handleRegisterClick, handleHomeClick];
}

export default useNavbar;
