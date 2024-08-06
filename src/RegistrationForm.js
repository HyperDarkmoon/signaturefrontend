import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import DrawingCanvas from './DrawingCanvas'; 
import './App.css'; 
import axios from 'axios';

function RegistrationForm() {
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
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
          
          // Scroll to top
          window.scrollTo(0, 0);
        }
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
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
    <Container className="mt-5 position-relative">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">User Registration</h2>
          {success && <Alert variant="success">{success}</Alert>}
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
                {formData.signature && (
                  <div className="mt-3">
                    <img src={formData.signature} alt="Signature" style={{ maxWidth: '100%' }} />
                  </div>
                )}
              </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4 w-100">
              Register
            </Button>
          </Form>
        </Col>
      </Row>

      {showDrawingCanvas && (
        <div className="drawing-canvas-widget">
          <DrawingCanvas onClose={handleCloseDrawingCanvas} onSave={handleCloseDrawingCanvas} />
        </div>
      )}
    </Container>
  );
}

export default RegistrationForm;
