import React, { useState } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import DrawingCanvas from './DrawingCanvas'; // Ensure DrawingCanvas is imported

const PersonalInformationForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        idCard: '',
        phoneNumber: '',
        address: '',
        signature: '',
    });
    const [error, setError] = useState('');
    const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for empty fields
        const { firstName, lastName, idCard, phoneNumber, address, signature } = formData;
        if (!firstName || !lastName || !idCard || !phoneNumber || !address) {
            setError('All fields are required.');
            return;
        }
        if (!signature) {
            setError('Signature is required.');
            return;
        }

        setError('');
        if (onSubmit) onSubmit(formData); // Trigger the submission function passed as a prop
    };

    const handleSignatureClick = () => {
        setShowDrawingCanvas(true);
    };

    const handleCloseDrawingCanvas = (image) => {
        if (image) {
            setFormData({ ...formData, signature: image });
        }
        setShowDrawingCanvas(false);
    };

    return (
        <div className="personal-info-card p-4">
            <h4 className="text-center mb-4">Personal Information</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mt-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your last name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formIdCard" className="mt-3">
                    <Form.Label>ID Card</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your ID card number"
                        name="idCard"
                        value={formData.idCard}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPhoneNumber" className="mt-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formAddress" className="mt-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter your address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formSignature" className="mt-3">
                    <Form.Label>Signature</Form.Label>
                    <div className="text-center">
                        <Button
                            variant="primary"
                            onClick={handleSignatureClick}
                            className="mt-2 w-100"
                        >
                            Draw Signature
                        </Button>
                        {formData.signature && (
                            <div className="mt-3">
                                <img
                                    src={formData.signature}
                                    alt="Signature"
                                    style={{ maxWidth: '50%' }}
                                />
                            </div>
                        )}
                    </div>
                </Form.Group>
            </Form>

            {/* Signature Canvas Modal */}
            <Modal show={showDrawingCanvas} onHide={() => setShowDrawingCanvas(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Draw Your Signature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DrawingCanvas onClose={handleCloseDrawingCanvas} onSave={handleCloseDrawingCanvas} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PersonalInformationForm;
