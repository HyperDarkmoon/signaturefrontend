import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import ProductList from './productList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="main-content" style={{ paddingTop: '60px' }}> {/* Adjust padding to account for fixed navbar */}
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/product-list" element={<ProductList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
