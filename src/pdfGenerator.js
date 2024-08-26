import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import axios from 'axios';

// Set the fonts for pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Fetches the Base64 string from a text file.
 *
 * @param {string} filePath - The path to the text file containing the Base64 string.
 * @returns {Promise<string>} - A promise that resolves to the Base64 string.
 * @throws {Error} - Throws an error if the file cannot be read.
 */
const fetchBase64FromFile = async (filePath) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch file from ${filePath}`);
        }
        const text = await response.text();
        return text.trim(); // Trim to remove any extra whitespace or newlines
    } catch (error) {
        console.error('Error fetching Base64 string:', error);
        throw error;
    }
};

/**
 * Generates and downloads a PDF containing user information.
 *
 * @param {string} username - The username of the user whose information is to be fetched and included in the PDF.
 * @returns {Promise<void>} - A promise that resolves when the PDF has been generated and downloaded.
 * @throws {Error} - Throws an error if there is an issue fetching user information or generating the PDF.
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
            dob: response.data.dob,
            date: response.data.date,
            idCardFront: response.data.idCardFront,
            idCardBack: response.data.idCardBack,
        };

        // Fetch the Base64 string from the text file
        const imageBase64 = await fetchBase64FromFile('/assets/imgData.txt');

        // Define the PDF document structure using the fetched user data
        const documentDefinition = {
            content: [
                {
                    columns: [
                        { text: 'SALES CONTRACT', style: 'contractHeader', alignment: 'left' },
                        { image: imageBase64, width: 100, alignment: 'right' }
                    ]
                },
                { text: 'This Sales Contract is made and entered into by and between the following parties:', margin : [0, 0, 0, 10]},
                { text: 'Buyer: ' + user.firstName + ' ' + user.lastName, margin: [0, 0, 0, 10] },
                { text: 'Seller: OOREDOO', margin: [0, 0, 0, 10] },
                { text: 'Item: ' + user.item, margin: [0, 0, 0, 10] },
                { text: 'Offer: ' + user.offer, margin: [0, 0, 0, 10] },
                { text: 'Date: ' + user.date, margin: [0, 0, 0, 10] },
                {

                    table: {
                        widths: ['*'], // This makes the table cell take up the full width
                        body: [
                            [
                                {
                                    text: 'Personal information',
                                    style: 'header',
                                    fillColor: 'red',
                                    color: 'white',
                                    margin: [0, 5, 0, 5], // Padding within the bar
                                    alignment: 'left'
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders' // Remove the table borders
                },
                { text: `First Name: ${user.firstName}`, margin: [0, 0, 0, 10] },
                { text: `Last Name: ${user.lastName}`, margin: [0, 0, 0, 10] },
                { text: `ID Card: ${user.idCard}`, margin: [0, 0, 0, 10] },
                { text: `Phone: ${user.phone}`, margin: [0, 0, 0, 10] },
                { text: `Date of Birth: ${user.dob}`, margin: [0, 0, 0, 10] },

                {
                    table: {
                        widths: ['*'], // This makes the table cell take up the full width
                        body: [
                            [
                                {
                                    text: 'Coordinates',
                                    style: 'header',
                                    fillColor: 'red',
                                    color: 'white',
                                    margin: [0, 5, 0, 5], // Padding within the bar
                                    alignment: 'left'
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders' // Remove the table borders
                },
                { text: `Address: ${user.address}`, margin: [0, 0, 0, 10] },
                { text: 'email: ' + user.email, margin: [0, 0, 0, 10] },
                { text: 'phone: ' + user.phone, margin: [0, 0, 0, 10] },

                {
                    table: {
                        widths: ['*'], // This makes the table cell take up the full width
                        body: [
                            [
                                {
                                    text: 'Signature',
                                    style: 'header',
                                    fillColor: 'red',
                                    color: 'white',
                                    margin: [0, 5, 0, 5], // Padding within the bar
                                    alignment: 'left'
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders' // Remove the table borders
                },
                { text: 'I agree to the terms and conditions of the sales contract.', margin: [0, 0, 0, 10] },
                { text: 'Signature:', margin: [0, 0, 0, 10] },
                user.signature ? { image: `data:image/png;base64,${user.signature}`, width: 150, margin: [0, 20], alignment: 'middle' } : {},

                // Force a new page after the signature
                { text: '', pageBreak: 'after' },

                // ID Card Front and Back Images
                {
                    text: 'ID Card : ',
                    style: 'header',
                    alignment: 'left',
                    margin: [0, 20, 0, 10]
                },
                { 
                    columns: [
                        user.idCardFront ? { image: `data:image/png;base64,${user.idCardFront}`, width: 250, margin: [0, 0, 10, 0] } : {},
                        user.idCardBack ? { image: `data:image/png;base64,${user.idCardBack}`, width: 250, margin: [10, 0, 0, 0] } : {}
                    ]
                }
            ],
            styles: {
                contractHeader: {
                    fontSize: 18,
                    bold: true,
                    color: 'red',
                    margin: [0, 20, 0, 10]
                },
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 20, 0, 50]
                },
                normal: {
                    fontSize: 12
                },
                // Additional styles can be defined here
            }
        };

        // Generate the PDF and trigger the download
        pdfMake.createPdf(documentDefinition).download(username + ' Contract.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};

export default generatePDF;

