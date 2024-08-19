import axios from "axios";

/**
 * Fetches the contracts from the server.
 *
 * @returns {Promise<Array>} - A promise that resolves to the list of users.
 * @throws {Error} - Throws an error if there is an issue fetching the contracts.
 */
const getContracts = async () => {
    try {
        const response = await axios.get('http://localhost:8085/api/users/allusers');
        return response.data; // Directly return the list of users
    } catch (error) {
        console.error('Error fetching contracts:', error);
        throw error;
    }
}

export default getContracts;
