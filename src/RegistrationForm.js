import React, { useState } from 'react';
import { Button, Form, Alert, Collapse } from 'react-bootstrap';
import axios from 'axios';
import './FormStyles.css'; // Import the CSS file where you added the arrow styles

/**
 * RegistrationForm component allows users to register by providing their username,
 * email, and password information. It handles form submission, validation, and checks
 * for existing users.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Whether the form should be displayed.
 * @param {Function} props.onClose - Function to handle closing the form.
 * @param {Function} props.onContinue - Function to handle proceeding to the next step.
 * @param {Function} props.onData - Function to pass form data to the parent component.
 * @example
 * return (
 *   <RegistrationForm 
 *     show={true} 
 *     onClose={() => console.log('Form closed')} 
 *     onContinue={() => console.log('Proceeding to next step')} 
 *     onData={(data) => console.log('Form data:', data)} 
 *   />
 * );
 */
const RegistrationForm = ({ show, onClose, onContinue, onData }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [open, setOpen] = useState(true);

    /**
     * Handles changes in form input fields.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Checks if a username or email already exists in the system.
     *
     * @param {string} username - The username to check.
     * @param {string} email - The email to check.
     * @returns {Promise<{usernameExists: boolean, emailExists: boolean}>} - A promise resolving to the existence status.
     */
    const checkUserExistence = async (username, email) => {
        try {
            const response = await axios.get(`http://localhost:8085/api/users/check?username=${username}&email=${email}`);
            return response.data;
        } catch (error) {
            console.error('Error checking user existence:', error);
            return { usernameExists: false, emailExists: false };
        }
    };

    /**
     * Handles form submission, validates input, checks for existing users, and passes data to the parent component.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
     */
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
            setOpen(!open);
            onContinue(); // Proceed to the next step
        }
    };

    return (
        <>
            <div>
                <div
                    className="arrow-container"
                    onClick={() => setOpen(!open)}
                >
                    <div className={`arrow ${open ? 'up' : 'down'}`}></div>
                    <span>{open ? 'Registration Form' : 'Registration Form'}</span>
                </div>
                <Collapse in={open}>
                    <div>
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
                                        variant="danger"
                                        type="submit"
                                        className="mt-4 w-100"
                                    >
                                        Continue
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>
        </>
    );
};

export default RegistrationForm;
