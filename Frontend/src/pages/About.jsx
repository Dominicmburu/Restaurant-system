import React from 'react';
import '../assets/styles/about/about.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const About = () => {
    return (
        <div className="about-page bg-light py-5">
            <Container>
                {/* Page Title */}
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold text-warning">About TurkNazz</h1>
                    <p className="lead text-muted">London’s Favorite Food Delivery Platform</p>
                </div>

                {/* Our Story Section */}
                <Row className="align-items-center mb-5">
                    <Col md={6}>
                        <img 
                            src="https://i.pinimg.com/736x/06/8d/c5/068dc52b100ec940bd407deea560481f.jpg" 
                            alt="Our Restaurant" 
                            className="img-fluid rounded shadow about-img"
                        />
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold">Our Story</h2>
                        <p className="text-muted">
                            TurkNazz was founded with one goal: bringing the best of London's restaurants to your doorstep. 
                            From gourmet dining to quick bites, we connect food lovers with their favorite eateries.
                        </p>
                    </Col>
                </Row>

                <Row className="align-items-center mb-5 flex-md-row-reverse">
                    <Col md={6}>
                        <img 
                            src="https://i.pinimg.com/736x/68/7e/16/687e16b383db5a854552169aacf463e5.jpg" 
                            alt="Our Mission" 
                            className="img-fluid rounded shadow about-img"
                        />
                    </Col>
                    <Col md={6}>
                        <h2 className="fw-bold">Our Mission</h2>
                        <p className="text-muted">
                            We aim to provide a seamless food delivery experience by partnering with the best restaurants across London.
                            Our focus is on quality, speed, and customer satisfaction.
                        </p>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col md={4}>
                        <Card className="shadow-sm border-0 p-3 text-center">
                            <i className="bi bi-star-fill text-warning fs-1 mb-3"></i>
                            <h5 className="fw-bold">Quality</h5>
                            <p className="text-muted">We ensure only the freshest and highest-quality ingredients.</p>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm border-0 p-3 text-center">
                            <i className="bi bi-truck text-warning fs-1 mb-3"></i>
                            <h5 className="fw-bold">Speed</h5>
                            <p className="text-muted">Fast delivery across all major areas of London.</p>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm border-0 p-3 text-center">
                            <i className="bi bi-emoji-smile text-warning fs-1 mb-3"></i>
                            <h5 className="fw-bold">Satisfaction</h5>
                            <p className="text-muted">Our customers’ happiness is our top priority.</p>
                        </Card>
                    </Col>
                </Row>

                {/* Contact Section */}
                <Row className="text-center">
                    <Col>
                        <h2 className="fw-bold">Get in Touch</h2>
                        <p className="text-muted">
                            Have questions or feedback? Reach out to us anytime, and our team will be happy to assist!
                        </p>
                        <Button variant="warning" size="lg" className="fw-bold text-dark">
                            Contact Us
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;
