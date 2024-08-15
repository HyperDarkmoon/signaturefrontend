import axios from 'axios';

const UserRegistration = async (data) => {
    try {
        // Access the actual form data from the data object
        const formData = data.formData;

        // Construct the user object with form data
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
        };

        // Log the user object to verify its contents
        console.log("user : ", user);

        // Send POST request to the backend
        const response = await axios.post('http://localhost:8085/api/users/register', user, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Handle successful registration
        if (response.status === 200) {
            console.log('Registration successful!');
            return response.data;
        }
    } catch (error) {
        // Error handling
        if (error.response && error.response.data) {
            console.error('Backend validation error:', error.response.data);
            throw new Error(error.response.data);
        } else if (error.request) {
            console.error('No response from server:', error.request);
            throw new Error('No response from server. Please try again later.');
        } else {
            console.error('Error message:', error.message);
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export default UserRegistration;


