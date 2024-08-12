import React, { useState } from 'react';
import { Button, Form, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import DrawingCanvas from './DrawingCanvas'; 

const RegistrationForm = ({ show, onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        signature: '',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);

    const validateSignature = (signature) => {
        if (!signature) {
            return false;
        }

        const img = new Image();
        img.src = signature;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        return new Promise((resolve) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const { data } = imageData;

                let isBlank = true;
                for (let i = 0; i < data.length; i += 4) {
                    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                    if (a !== 0 && !(r === 255 && g === 255 && b === 255)) {
                        isBlank = false;
                        break;
                    }
                }

                resolve(!isBlank);
            };
        });
    };

    const validateForm = async () => {
        const newErrors = {};

        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        const isSignatureValid = await validateSignature(formData.signature);
        if (!isSignatureValid) newErrors.signature = 'Signature is required and cannot be blank';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (await validateForm()) {
            try {
                const user = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    signature: formData.signature ? formData.signature.split(',')[1] : '' 
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
        } else {
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
        <>
            <div>
                <div className="card-body">
                    <h4 className="text-center mb-4">Registration Form</h4>
                    {success && <Alert variant="success">{success}</Alert>}
                    {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formConfirmPassword" className="mt-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formSignature" className="mt-3">
                            <Form.Label>Signature</Form.Label>
                            <div className="text-center">
                                <Button variant="success" onClick={handleSignatureClick}>
                                    Input Signature
                                </Button>
                                {errors.signature && <div className="text-danger mt-2">{errors.signature}</div>}
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

                        <Button variant="primary" type="submit" className="mt-4 w-100">
                            Register
                        </Button>
                    </Form>
                </div>
            </div>

            {/* Signature Canvas Modal */}
            <Modal show={showDrawingCanvas} onHide={() => setShowDrawingCanvas(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Draw Your Signature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DrawingCanvas onClose={handleCloseDrawingCanvas} onSave={handleCloseDrawingCanvas} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RegistrationForm;
