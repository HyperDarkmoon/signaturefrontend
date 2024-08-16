import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import axios from 'axios';

// Set the fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generatePDF = async (username) => {
    try {
        // Fetch user information
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

        // Define documentDefinition using the fetched user data
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
                // Optional: Add the signature as an image if needed
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
                // Define other styles here
            }
        };

        // Generate and download the PDF
        pdfMake.createPdf(documentDefinition).download('user-information.pdf');
    } catch (error) {
        console.error('Error fetching user information:', error);
    }
};

export default generatePDF;
