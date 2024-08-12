import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import RegistrationForm from './RegistrationForm'; // Import the RegistrationForm component
import './productList.css'; // Custom CSS file

const ProductList = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState('Select Offer');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false); // State for registration card visibility

    const items = [
        {
            id: 1,
            name: 'SIM Card',
            details: 'Choose your offer',
            offers: ['Offer 1', 'Offer 2', 'Offer 3'],
        },
        {
            id: 2,
            name: 'MBB Device',
            details: 'Choose your offer',
            offers: ['Offer 4', 'Offer 5', 'Offer 6'],
        },
    ];

    const handleItemClick = (itemId) => {
        if (selectedItem === itemId) {
            // Deselect item if clicked again
            setSelectedItem(null);
            setShowRegistration(false); // Hide registration card
        } else {
            setSelectedItem(itemId);
            setSelectedOffer('Select Offer');
            setDropdownOpen(false);
            setShowRegistration(false); // Hide registration card when a new item is selected
        }
    };

    const handleOfferSelect = (offer) => {
        setSelectedOffer(offer);
        setDropdownOpen(false);
    };

    const handleDropdownToggle = (isOpen) => {
        setDropdownOpen(isOpen);
    };

    const handleRegisterClick = () => {
        setShowRegistration(true); // Show registration card
    };

    const selectedItemDetails = items.find(item => item.id === selectedItem);

    return (
        <div className="container">
            <div className="row">
                {items.map(item => (
                    <div
                        key={item.id}
                        className="col-md-6 mb-4"
                        onClick={() => handleItemClick(item.id)}
                    >
                        <div className={`card product-card ${selectedItem === item.id ? 'expanded' : ''}`}>
                            <div className="card-body">
                                <h3 className="card-title">{item.name}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedItemDetails && (
                <div className="row justify-content-center mt-4">
                    <div className="col-md-8">
                        <div className={`card detail-card ${dropdownOpen ? 'expanded' : ''}`}>
                            <div className="card-body text-center">
                                <h4>{selectedItemDetails.name}</h4>
                                <p>{selectedItemDetails.details}</p>

                                <DropdownButton
                                    id="dropdown-basic-button"
                                    title={selectedOffer}
                                    variant="secondary"
                                    onToggle={handleDropdownToggle}
                                    className="dropdown-button"
                                >
                                    {selectedItemDetails.offers.map((offer, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => handleOfferSelect(offer)}
                                        >
                                            {offer}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>

                                <Button
                                    className="mt-3"
                                    variant="primary"
                                    onClick={handleRegisterClick}
                                >
                                    Register
                                </Button>
                            </div>
                        </div>

                        {showRegistration && (
                            <div className="row justify-content-center mt-4">
                                <div className="col-md-8">
                                    <div className="card registration-card">
                                        <div className="card-body">
                                            <RegistrationForm
                                                show={showRegistration}
                                                onClose={() => setShowRegistration(false)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
