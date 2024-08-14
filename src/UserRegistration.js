import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Alert, Modal } from 'react-bootstrap';
import RegistrationForm from './RegistrationForm'; // Import the RegistrationForm component
import PersonalInformationForm from './PersonalInformationForm'; // Import the PersonalInformationForm component
import DrawingCanvas from './DrawingCanvas'; // Ensure DrawingCanvas is imported

const UserRegistration = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        signature: '',
        firstName: '',
        lastName: '',
        idCard: '',
        phoneNumber: '',
        address: '',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
    const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                signature: formData.signature ? formData.signature.split(',')[1] : '',
                personalInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    idCard: formData.idCard,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                }
            };

            const response = await axios.post('http://localhost:8085/api/users/register', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    signature: '',
                    firstName: '',
                    lastName: '',
                    idCard: '',
                    phoneNumber: '',
                    address: '',
                });
                setErrors({});
                setSuccess('Registration successful!');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data;
                if (errorMessage === "Username already exists") {
                    setErrors({ username: errorMessage });
                } else if (errorMessage === "Email already exists") {
                    setErrors({ email: errorMessage });
                } else {
                    setErrors({ general: 'An error occurred. Please try again.' });
                }
            } else if (error.request) {
                console.error('Error request:', error.request);
                setErrors({ general: 'No response from server. Please try again later.' });
            } else {
                console.error('Error message:', error.message);
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
            setSuccess('');
        }
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
        <div className="container">
            <h2 className="text-center mb-4">User Registration</h2>
            {success && <Alert variant="success">{success}</Alert>}
            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <RegistrationForm
                    formData={formData}
                    handleChange={handleFormChange}
                    handleSignatureClick={handleSignatureClick}
                    errors={errors}
                />
                {showPersonalInfoForm && (
                    <PersonalInformationForm
                        formData={formData}
                        handleChange={handleFormChange}
                        errors={errors}
                    />
                )}
                <Button
                    variant="primary"
                    type="submit"
                    className="mt-4 w-100"
                >
                    Submit
                </Button>
            </Form>

            <Modal show={showDrawingCanvas} onHide={() => setShowDrawingCanvas(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Draw Your Signature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DrawingCanvas onClose={handleCloseDrawingCanvas} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserRegistration;
