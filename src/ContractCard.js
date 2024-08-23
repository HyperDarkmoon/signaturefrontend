import React from 'react';
import { Card, Button } from 'react-bootstrap'; // Import Button
import './ContractCard.css'; // Import custom CSS
import generatePDF from './pdfGenerator'; // Import PDF generation function

const ContractCard = ({ user }) => {
  // Function to handle PDF generation
  const handleGeneratePDF = () => {
    const username = user?.username; // Access user object directly
    if (username) {
      generatePDF(username);
    }
  };

  return (
    <Card className="mb-3 contract-card">
      <Card.Body>
        <Card.Text>
          <strong>First Name:</strong> {user.firstName}<br />
          <strong>Last Name:</strong> {user.lastName}<br />
          <strong>ID Card:</strong> {user.idCard}<br />
          <strong>Phone:</strong> {user.phone}
        </Card.Text>
        <Button variant="danger" onClick={handleGeneratePDF}>
          Download contract PDF
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ContractCard;
