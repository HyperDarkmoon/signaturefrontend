import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './productList.css'; // Custom CSS file

const ProductList = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState('Select Offer'); // State for selected offer

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
        setSelectedOffer('Select Offer'); // Reset selected offer when item changes
    };

    const handleOfferSelect = (offer) => {
        setSelectedOffer(offer); // Update the selected offer
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
                        <div className="card product-card">
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
                        <div className="card detail-card">
                            <div className="card-body text-center">
                                <h4>{selectedItemDetails.name}</h4>
                                <p>{selectedItemDetails.details}</p>

                                {/* Dropdown for offers */}
                                <DropdownButton
                                    id="dropdown-basic-button"
                                    title={selectedOffer} // Display selected offer
                                    variant="secondary"
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

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
