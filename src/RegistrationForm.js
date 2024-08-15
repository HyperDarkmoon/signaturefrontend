import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const RegistrationForm = ({ show, onClose, onContinue, onData }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const checkUserExistence = async (username, email) => {
        try {
            console.log(`Checking user existence for username: ${username} and email: ${email}`);
            const response = await axios.get(`http://localhost:8085/api/users/check?username=${username}&email=${email}`);
            console.log('Response from checkUserExistence:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return { usernameExists: false, emailExists: false };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.username) errors.username = 'Username is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords must match';

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setErrors({});

        // Check for existing username and email
        const { usernameExists, emailExists } = await checkUserExistence(formData.username, formData.email);

        // Update the errors state with both errors if they exist
        const newErrors = {};
        if (usernameExists) newErrors.username = 'Username already exists';
        if (emailExists) newErrors.email = 'Email already exists';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (onData) {
            onData(formData); // Pass data to parent component
            setSuccess('Registered successfully!');
            onContinue(); // Proceed to the next step
        }
    };

    return (
        <>
            <div>
                <div className="card-body">
                    <h4 className="text-center mb-4">Registration Form</h4>
                    {success && <Alert variant="success">{success}</Alert>}
                    {Object.keys(errors).length > 0 && <Alert variant="danger">{Object.values(errors).join(', ')}</Alert>}
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

                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-4 w-100"
                        >
                            Continue
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default RegistrationForm;
