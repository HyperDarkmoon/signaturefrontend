import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import axios from 'axios';

// Set the fonts for pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Generates and downloads a PDF containing user information.
 *
 * This function fetches user data from the server based on the provided username,
 * creates a PDF document with the fetched data, and triggers a download of the PDF.
 *
 * @param {string} username - The username of the user whose information is to be fetched and included in the PDF.
 * @returns {Promise<void>} - A promise that resolves when the PDF has been generated and downloaded.
 * @throws {Error} - Throws an error if there is an issue fetching user information or generating the PDF.
 *
 * @example
 * // Example usage
 * generatePDF('john_doe');
 */
const generatePDF = async (username) => {
    try {
        // Fetch user information from the server
        const response = await axios.get(`http://localhost:8085/api/users/information?username=${username}`);
        const user = {
            username: response.data.username,
            email: response.data.email,
            password: response.data.password,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            idCard: response.data.idCard,
            phone: response.data.phone,
            address: response.data.address,
            signature: response.data.signature,
            offer: response.data.offer,
            item: response.data.item,
        };

        // Define the PDF document structure using the fetched user data
        const documentDefinition = {
            content: [
                { text: 'User Information', style: 'header' },
                { text: `Username: ${user.username}`, margin: [0, 0, 0, 10] },
                { text: `Email: ${user.email}`, margin: [0, 0, 0, 10] },
                { text: `First Name: ${user.firstName}`, margin: [0, 0, 0, 10] },
                { text: `Last Name: ${user.lastName}`, margin: [0, 0, 0, 10] },
                { text: `ID Card: ${user.idCard}`, margin: [0, 0, 0, 10] },
                { text: `Phone: ${user.phone}`, margin: [0, 0, 0, 10] },
                { text: `Address: ${user.address}`, margin: [0, 0, 0, 10] },
                { text: `Offer: ${user.offer}`, margin: [0, 0, 0, 10] },
                { text: `Item: ${user.item}`, margin: [0, 0, 0, 10] },
                user.signature ? { image: `data:image/png;base64,${user.signature}`, width: 300, margin: [0, 20] } : {}
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 20, 0, 10]
                },
                normal: {
                    fontSize: 12
                },
                // Additional styles can be defined here
            }
        };

        // Generate the PDF and trigger the download
        pdfMake.createPdf(documentDefinition).download('user-information.pdf');
    } catch (error) {
        console.error('Error fetching user information:', error);
    }
};

export default generatePDF;
