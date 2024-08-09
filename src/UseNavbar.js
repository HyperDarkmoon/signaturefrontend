import { useState } from 'react';

function UseNavBar() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleRegisterClick = () => {
    setShowRegistrationForm(true);
  };

  const handleHomeClick = () => {
    setShowRegistrationForm(false);
  };

  return [showRegistrationForm, handleRegisterClick, handleHomeClick];
}

export default UseNavBar;
