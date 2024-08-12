import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton, Button, Form } from 'react-bootstrap';
import './productList.css'; // Custom CSS file

const ProductList = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState('Select Offer');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false); // New state for registration card

    const items = [
        {
            id: 1,
            name: 'Item 1',
            details: 'Details of Item 1',
            offers: ['Offer 1', 'Offer 2', 'Offer 3'],
        },
        {
            id: 2,
            name: 'Item 2',
            details: 'Details of Item 2',
            offers: ['Offer 4', 'Offer 5', 'Offer 6'],
        },
    ];

    const handleItemClick = (itemId) => {
        setSelectedItem(selectedItem === itemId ? null : itemId);
        setSelectedOffer('Select Offer');
        setDropdownOpen(false);
        setShowRegistration(false); // Hide registration card when item is toggled
    };

    const handleOfferSelect = (offer) => {
        setSelectedOffer(offer);
        setDropdownOpen(false);
    };

    const handleDropdownToggle = (isOpen) => {
        setDropdownOpen(isOpen);
    };

    const handleRegisterClick = () => {
        setShowRegistration(true); // Show registration card when button is clicked
    };

    const selectedItemDetails = items.find(item => item.id === selectedItem);

    return (
        <div className="container">
            <div className="row">
                {items.map((item) => (
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

                                {/* Button to show registration card */}
                                <Button
                                    className="mt-3"
                                    variant="primary"
                                    onClick={handleRegisterClick}
                                >
                                    Register
                                </Button>
                            </div>
                        </div>

                        {/* Registration card */}
                        {showRegistration && (
                            <div className="row justify-content-center mt-4">
                                <div className="col-md-8">
                                    <div className="card registration-card">
                                        <div className="card-body">
                                            <h4 className="text-center mb-4">Registration Form</h4>
                                            <Form>
                                                <Form.Group controlId="formName">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter your name" />
                                                </Form.Group>

                                                <Form.Group controlId="formEmail">
                                                    <Form.Label>Email address</Form.Label>
                                                    <Form.Control type="email" placeholder="Enter your email" />
                                                </Form.Group>

                                                <Form.Group controlId="formPassword">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control type="password" placeholder="Enter your password" />
                                                </Form.Group>

                                                <Form.Group controlId="formConfirmPassword">
                                                    <Form.Label>Confirm Password</Form.Label>
                                                    <Form.Control type="password" placeholder="Confirm your password" />
                                                </Form.Group>

                                                <Button variant="primary" type="submit">
                                                    Submit
                                                </Button>
                                            </Form>
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
