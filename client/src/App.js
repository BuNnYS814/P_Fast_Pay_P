import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Transaction from './pages/transation'; 
import { Navbar, Nav, Container, NavDropdown, ThemeProvider } from "react-bootstrap";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import { Toast } from 'primereact/toast';

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const toast = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    return (
        <ThemeProvider>
            <Toast ref={toast} />
            <Router>
                <div className="app-container">
                    <Navbar bg="primary" variant="dark" expand="md" className="modern-nav">
                        <Container>
                            <Navbar.Brand as={Link} to="/" className="brand-logo">
                                <i className="pi pi-wallet me-2"></i>
                                Fast-Pay
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbar-nav" />
                            <Navbar.Collapse id="navbar-nav">
                                <Nav className="ml-auto">
                                    {user ? (
                                        <>
                                        <Nav.Link as={Link} to="/transaction">Home</Nav.Link>
                                            <NavDropdown title={<><i className="bi bi-person-circle"></i> {user.email}</>} id="nav-dropdown">
                                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                            </NavDropdown>
                                        </>
                                    ) : (
                                        <>
                                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                            <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                                        </>
                                    )}
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    <Container className="mt-4 main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/transaction" element={<Transaction />} />
                        </Routes>
                    </Container>
                    <footer className="footer mt-auto py-3 bg-light">
                        <Container className="text-center">
                            <span className="text-muted">© 2024 Fast-Pay. All rights reserved.</span>
                        </Container>
                    </footer>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
