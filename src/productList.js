import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import RegistrationForm from './RegistrationForm';
import PersonalInformationForm from './PersonalInformationForm';
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
        resetState();
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
        console.log('Personal Information Submitted:', data);
    };

    const handleRegistrationFormData = (data) => {
        setRegistrationData(data);
        console.log('Registration Form Data:', data);
    };

    const handleSubmit = async () => {
        if (registrationData && personalInfoData) {
            const combinedData = {
                ...registrationData,
                ...personalInfoData,
                selectedOffer,
            };

            console.log('Submitting combined data:', combinedData);

            try {
                await UserRegistration({
                    formData: combinedData,
                    onSuccess: () => {
                        console.log('Registration successful!');
                    },
                    onError: (error) => {
                        console.error('Error during registration:', error);
                    }
                });
            } catch (error) {
                console.error('Error submitting data:', error);
            }
        } else {
            console.log('Both forms must be filled out before submission.');
        }
    };

    const resetState = () => {
        setSelectedOffer('Select Offer');
        setShowRegistration(false);
        setShowBlankCard(false);
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
                    </div>
                </div>
            )}

            <Button
                variant="primary"
                onClick={handleSubmit}
                className="w-50 mt-3"
            >
                Submit
            </Button>
        </div>
    );
};

export default ProductList;
