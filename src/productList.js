import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton, Button, Modal } from 'react-bootstrap';
import RegistrationForm from './RegistrationForm';
import PersonalInformationForm from './PersonalInformationForm.js';
import './productList.css';
import UserRegistration from './UserRegistration';
import generatePDF from './pdfGenerator.js';

// Import the images from the assets folder
import device1Image from './assets/device1.png';
import device2Image from './assets/device2.png';
import device3Image from './assets/device3.png';
/**
 * The `ProductList` component displays a list of products and offers functionality to register and submit user data.
 * It allows users to select a product, choose offers or devices, and fill out registration and personal information forms.
 * It also handles success and error states through modals.
 * 
 * @component
 * @example
 * return (
 *   <ProductList />
 * )
 */
const ProductList = () => {
    /**
    * @typedef {Object} Item
    * @property {number} id - The unique identifier for the item.
    * @property {string} name - The name of the item.
    * @property {string} details - Additional details about the item.
    * @property {Array<string>} [offers] - List of offers for the item.
    * @property {Array<{ name: string, image: string }>} [device] - List of devices with images for the item.
    * @property {Object<string, Array<string>>} [offer] - Mapping of device names to their respective offers.
    */

    /**
     * List of items to display.
     * @type {Item[]}
     */
    const items = [
        {
            id: 1,
            name: 'SIM Card',
            details: 'Choose your offer',
            offers: ['10GB per month', '25GB per month', '50GB per month'],
        },
        {
            id: 2,
            name: 'MBB Device',
            details: 'Choose your device',
            device: [
                { name: 'Flybox 4G', image: device1Image },
                { name: 'Airbox 4G', image: device2Image },
                { name: 'Key 4G', image: device3Image },
            ],
            offer: {
                'Flybox 4G': ['25 GB', '75 GB', '125 GB'],
                'Airbox 4G': ['25 GB', '75 GB', '125 GB'],
                'Key 4G': ['25 GB', '75 GB', '125 GB'],
            },
        },
    ];

    const [selectedItem, setSelectedItem] = useState(null);
    var [selectedOffer, setSelectedOffer] = useState('Select Offer');
    const [selectedDevice, setselectedDevice] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showBlankCard, setShowBlankCard] = useState(false);
    const [personalInfoData, setPersonalInfoData] = useState(null);
    const [registrationData, setRegistrationData] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showErrorOverlay, setShowErrorOverlay] = useState(false);
    /**
         * Handles the item click event to select or deselect an item.
         * Resets device and offer selections when changing items.
         * 
         * @param {number} itemId - The ID of the clicked item.
         */
    const handleItemClick = (itemId) => {
        setSelectedItem(selectedItem === itemId ? null : itemId);
        setselectedDevice(null); // Reset selected device when switching items
        setSelectedOffer('Select Offer'); // Reset selected offer when switching items
        setShowRegistration(false); // Close the registration form when switching items
        setShowBlankCard(false); // Close the personal information form when switching items
    };
    /**
        * Handles the device selection event.
        * 
        * @param {string} device - The name of the selected device.
        */
    const handledeviceelect = (device) => {
        setselectedDevice(device);
        setSelectedOffer('Select Offer'); // Reset selected offer when switching device
    };
    /**
         * Handles the offer selection event from the dropdown.
         * 
         * @param {string} offer - The selected offer.
         */
    const handleOfferSelect = (offer) => {
        setSelectedOffer(offer);
        setDropdownOpen(false);
    };
    /**
        * Handles the dropdown toggle event.
        * 
        * @param {boolean} isOpen - Whether the dropdown is open.
        */
    const handleDropdownToggle = (isOpen) => {
        setDropdownOpen(isOpen);
    };
    /**
     * Handles the click event for the register button.
     * Shows the registration form if an offer is selected.
     */
    const handleRegisterClick = () => {
        if (selectedOffer !== 'Select Offer') {
            setShowRegistration(true);
        }
    };
    /**
         * Handles the click event for the continue button.
         * Shows the personal information form.
         */
    const handleContinueClick = () => {
        setShowBlankCard(true);
    };
    /**
     * Handles the submission of personal information data.
     * 
     * @param {Object} data - The personal information data.
     */
    const handlePersonalInfoSubmit = (data) => {
        setPersonalInfoData(data);
    };
    /**
         * Handles the submission of registration form data.
         * 
         * @param {Object} data - The registration data.
         */
    const handleRegistrationFormData = (data) => {
        setRegistrationData(data);
    };
    /**
       * Handles the submission of the combined registration and personal information data.
       * Sends the data to the server and manages success and error states.
       */
    const handleSubmit = async () => {

        if (selectedItemDetails.name === 'MBB Device') {
            selectedOffer = selectedItemDetails.name + ' ' + selectedDevice + ' ' + selectedOffer;
        }

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
    /**
        * Handles the generation of a PDF for the registration.
        */
    const handleGeneratePDF = () => {
        const username = registrationData?.username;
        if (username) {
            generatePDF(username);
        }
    };
    /**
       * Resets the state to its initial values after form submission.
       * Preserves the username in registrationData if available.
       */
    const resetState = () => {
        setSelectedOffer('Select Offer');
        setShowRegistration(false);
        setShowBlankCard(false);
        setSelectedItem(null);
        setselectedDevice(null);
        setPersonalInfoData(null);

        // Preserve the username in registrationData
        setRegistrationData(prevState => ({
            ...prevState,
            username: prevState?.username || null
        }));
    };
    /**
        * Finds the details of the currently selected item.
        * 
        * @type {Item | undefined}
        */
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

                                {selectedItemDetails.name === 'MBB Device' ? (
                                    // Render device boxes with images for MBB Device
                                    <div className="d-flex justify-content-around">
                                        {selectedItemDetails.device.map((device, index) => (
                                            <Button
                                                key={index}
                                                variant={selectedDevice === device.name ? "primary" : "secondary"}
                                                onClick={() => handledeviceelect(device.name)}
                                                className="device-button"
                                            >
                                                <img
                                                    src={device.image}
                                                    alt={device.name}
                                                    className="device-image"
                                                />
                                                <span>{device.name}</span>
                                            </Button>
                                        ))}

                                    </div>
                                ) : (
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
                                )}

                                {selectedDevice && (
                                    <DropdownButton
                                        id="dropdown-device-button"
                                        title={selectedOffer}
                                        variant="secondary"
                                        onToggle={handleDropdownToggle}
                                        className="dropdown-button mt-3"
                                    >
                                        {selectedItemDetails.offer[selectedDevice].map((offer, index) => (
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => handleOfferSelect(offer)}
                                            >
                                                {offer}
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                )}

                                <Button
                                    className="mt-3"
                                    variant="danger"
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
                                variant="danger"
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
                    <Button variant="danger" onClick={() => setShowOverlay(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleGeneratePDF}>
                        Download contract PDF
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
                    <p>Both forms must be filled out before submission!</p>
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
