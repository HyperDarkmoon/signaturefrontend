import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Modal, Collapse } from 'react-bootstrap';
import DrawingCanvas from './DrawingCanvas';
import './FormStyles.css';


/**
 * PersonalInformationForm component allows users to input their personal information including
 * their name, ID card number, phone number, address, and a signature. It also handles form validation,
 * shows an error message if validation fails, and displays a drawing canvas for the signature.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onSubmit - Function to handle submission of the form data.
 * @example
 * return (
 *   <PersonalInformationForm onSubmit={(data) => console.log('Submitted data:', data)} />
 * );
 */
const PersonalInformationForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        idCard: '',
        phoneNumber: '',
        address: '',
        signature: '',
        dob: '',
        idCardFront: '',
        idCardBack: '',
    });
    const [error, setError] = useState('');
    const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (onSubmit) {
            onSubmit(formData);
        }
    }, [formData, onSubmit]);

    /**
        * Handles changes in form input fields.
        *
        * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
        */
    const handleChange = (e) => {
        const { name, files } = e.target;

        if (files && files.length > 0) {
            const updatedFormData = { ...formData };

            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (name === 'idCardFront') {
                        updatedFormData.idCardFront = reader.result;
                    } else if (name === 'idCardBack') {
                        updatedFormData.idCardBack = reader.result;
                    }
                    setFormData(updatedFormData);
                };
                reader.readAsDataURL(file);
            });
        } else {
            setFormData({ ...formData, [name]: e.target.value });
        }
    };

    /**
        * Handles form submission. Validates the input and sets an error if validation fails.
        *
        * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
        */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, idCard, phoneNumber, address, signature, idCardFront, idCardBack } = formData;
        if (!firstName || !lastName || !idCard || !phoneNumber || !address) {
            setError('All fields are required.');
            return;
        }
        if (!signature) {
            setError('Signature is required.');
            return;
        }
        if (!idCardFront) {
            setError('ID Card Image is required.');
            return;
        }

        if (!idCardBack) {
            setError('ID Card Image is required.');
            return;
        }

    }

    /**
    * Shows the drawing canvas modal for the user to draw their signature.
    */
    const handleSignatureClick = () => {
        setShowDrawingCanvas(true);
    };

    /**
      * Handles closing the drawing canvas modal and updates the form data with the drawn signature.
      *
      * @param {string} image - The drawn signature image.
      */
    const handleCloseDrawingCanvas = (image) => {
        if (image) {
            setFormData({ ...formData, signature: image });
        }
        setShowDrawingCanvas(false);
    };

    return (
        <div>
            <div className="arrow-container" onClick={() => setOpen(!open)}>
                <div className={`arrow ${open ? 'up' : 'down'}`}></div>
                <span>{open ? 'Personal Information' : 'Personal Information'}</span>
            </div>
            <Collapse in={open}>
                <div>
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
                                type="text"
                                placeholder="Enter your phone number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDob" className="mt-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Enter your date of birth"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress" className="mt-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <br></br>
                        <h2>Please upload the front and back of your ID card</h2>
                        <Form.Group controlId="formidCardFront" className="mt-3">
                            <Form.Label>ID Card Front Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                name="idCardFront"
                                onChange={handleChange}
                                required
                            />
                            {formData.idCardFront && <img src={formData.idCardFront} alt="ID Card Front" className="img-preview" />}
                        </Form.Group>
                        <Form.Group controlId="formidCardBack" className="mt-3">
                            <Form.Label>ID Card Back Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                name="idCardBack"
                                onChange={handleChange}
                                required
                            />
                            {formData.idCardBack && <img src={formData.idCardBack} alt="ID Card Back" className="img-preview" />}
                        </Form.Group>
                        <Form.Group controlId="formSignature" className="mt-3">
                            <Form.Label>Signature</Form.Label>
                            <br></br>
                            <Button onClick={handleSignatureClick} variant="danger">
                                Draw Signature
                            </Button>
                            {formData.signature && <img src={formData.signature} alt="Signature" className="mt-2" />}
                        </Form.Group>
                    </Form>
                </div>
            </Collapse>

            <Modal show={showDrawingCanvas} onHide={() => setShowDrawingCanvas(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Draw Signature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DrawingCanvas
                        onSave={handleCloseDrawingCanvas}
                        onClose={() => setShowDrawingCanvas(false)} // Make sure this is defined
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PersonalInformationForm;
