import axios from 'axios';

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

        const response = await axios.post('http://localhost:8085/api/users/register', user, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            if (onSuccess) onSuccess(); // Trigger onSuccess callback
            return response.data;
        }
    } catch (error) {
        if (onError) {
            onError(error);
        }
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


