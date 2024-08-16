import axios from 'axios';

/**
 * Registers a new user by sending their data to the backend server.
 * 
 * @param {Object} params - The parameters for user registration.
 * @param {Object} params.data - The user data to be sent to the backend.
 * @param {Function} [params.onSuccess] - Callback function to be called upon successful registration.
 * @param {Function} [params.onError] - Callback function to be called when an error occurs.
 * @returns {Promise<Object>} The response data from the server if registration is successful.
 * @throws {Error} Throws an error if the registration fails or if there's an issue with the request.
 */
const UserRegistration = async ({ data, onSuccess, onError }) => {
    try {
        const formData = data.formData;

        const user = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            idCard: formData.idCard,
            phone: formData.phoneNumber,
            address: formData.address,
            signature: formData.signature ? formData.signature.split(',')[1] : '',
            offer: formData.selectedOffer,
            item: formData.selectedItem,
        };

        // Send a POST request to the backend server for user registration
        const response = await axios.post('http://localhost:8085/api/users/register', user, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            if (onSuccess) onSuccess(); // Trigger onSuccess callback if provided
            return response.data;
        }
    } catch (error) {
        if (onError) {
            onError(error); // Trigger onError callback if provided
        }
        if (error.response && error.response.data) {
            console.error('Backend validation error:', error.response.data);
            throw new Error(error.response.data); // Throw an error with the backend validation message
        } else if (error.request) {
            console.error('No response from server:', error.request);
            throw new Error('No response from server. Please try again later.'); // Throw an error if there's no response from the server
        } else {
            console.error('Error message:', error.message);
            throw new Error('An unexpected error occurred. Please try again.'); // Throw an unexpected error
        }
    }
};

export default UserRegistration;
