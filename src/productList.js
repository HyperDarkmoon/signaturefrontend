import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton, Button, Modal } from 'react-bootstrap';
import RegistrationForm from './RegistrationForm';
import PersonalInformationForm from './PersonalInformationForm.js';
import './productList.css';
import UserRegistration from './UserRegistration';

const ProductList = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState('Select Offer');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showBlankCard, setShowBlankCard] = useState(false);
    const [personalInfoData, setPersonalInfoData] = useState(null);
    const [registrationData, setRegistrationData] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showErrorOverlay, setShowErrorOverlay] = useState(false); // New state for error overlay

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
        setSelectedItem(selectedItem === itemId ? null : itemId);
    };

    const handleOfferSelect = (offer) => {
        setSelectedOffer(offer);
        setDropdownOpen(false);
    };

    const handleDropdownToggle = (isOpen) => {
        setDropdownOpen(isOpen);
    };

    const handleRegisterClick = () => {
        if (selectedOffer !== 'Select Offer') {
            setShowRegistration(true);
        }
    };

    const handleContinueClick = () => {
        setShowBlankCard(true);
    };

    const handlePersonalInfoSubmit = (data) => {
        setPersonalInfoData(data);
    };

    const handleRegistrationFormData = (data) => {
        setRegistrationData(data);
    };

    const handleSubmit = async () => {
        if (registrationData && personalInfoData) {
            const combinedData = {
                ...registrationData,
                ...personalInfoData,
                selectedOffer,
                selectedItem: selectedItemDetails.name,
            };
    
            try {
                await UserRegistration({
                    data: { formData: combinedData },
                    onSuccess: () => {
                        setShowOverlay(true); // Show overlay on success
                        resetState();          // Reset the state after submission
                    },
                    onError: (error) => {
                        setShowErrorOverlay(true); // Show error overlay if forms are not filled out
                    }
                });
            } catch (error) {
                setShowErrorOverlay(true); // Show error overlay if forms are not filled out
            }
        } else {
            setShowErrorOverlay(true); // Show error overlay if forms are not filled out
        }
    };

    const resetState = () => {
        setSelectedOffer('Select Offer');
        setShowRegistration(false);
        setShowBlankCard(false);
        setSelectedItem(null);
        setPersonalInfoData(null);
        setRegistrationData(null);
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
                                                onContinue={handleContinueClick}
                                                onData={handleRegistrationFormData}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showBlankCard && (
                            <div className="row justify-content-center mt-4">
                                <div className="col-md-8">
                                    <div className="card personal-information-card">
                                        <div className="card-body">
                                            <PersonalInformationForm onSubmit={handlePersonalInfoSubmit} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showBlankCard && ( // Conditionally render the submit button
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                className="w-50 mt-3"
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Success Overlay Modal */}
            <Modal
                show={showOverlay}
                onHide={() => setShowOverlay(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your registration was successful!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowOverlay(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Error Overlay Modal */}
            <Modal
                show={showErrorOverlay}
                onHide={() => setShowErrorOverlay(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Both forms must be filled out before submission.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowErrorOverlay(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductList;
