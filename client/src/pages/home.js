import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';  // Create this new file for custom styles

function Home() {
    return (
        <div className="home-page">
            <div className="hero-section">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col md={8}>
                            <h1 className="hero-title">Welcome to Fast-Pay</h1>
                            <p className="hero-subtitle">
                                Your secure digital wallet for fast and easy payments
                            </p>
                            <div className="hero-buttons">
                                <Link to="/signup">
                                    <Button variant="primary" size="lg" className="glow-button me-3">
                                        Get Started
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline-light" size="lg">
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="features-section">
                <Row className="mt-5">
                    <Col md={4} className="feature-card">
                        <div className="feature-icon">
                            <span>⚡</span>
                        </div>
                        <h3>Fast</h3>
                        <p>Lightning-quick transactions at your fingertips</p>
                    </Col>
                    <Col md={4} className="feature-card">
                        <div className="feature-icon">
                            <span>🛡️</span>
                        </div>
                        <h3>Secure</h3>
                        <p>Bank-grade security for your peace of mind</p>
                    </Col>
                    <Col md={4} className="feature-card">
                        <div className="feature-icon">
                            <span>📱</span>
                        </div>
                        <h3>Simple</h3>
                        <p>Intuitive interface for seamless payments</p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;
  