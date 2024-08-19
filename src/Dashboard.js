import React, { useState, useEffect } from 'react';
import getContracts from './getContracts'; // Import your function
import ContractCard from './ContractCard'; // Import the card component
import { Pagination, Container } from 'react-bootstrap'; // Using react-bootstrap for pagination
import './Dashboard.css'; // Import custom CSS

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getContracts();
        setUsers(data); // Set users to the fetched data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Calculate current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Create pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Dashboard</h1>
        <Container className="d-flex flex-wrap justify-content-center">
          {currentUsers.map(user => (
            <ContractCard key={user.username} user={user} />
          ))}
        </Container>
        <div className="pagination-container d-flex justify-content-center mt-4">
          <Pagination>
            {pageNumbers.map(number => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => paginate(number)}
              >
                {number}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
