import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
    };

    return (
        <div className="contact-page bg-light py-5">
            <Container>
                {/* Page Header */}
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold text-warning">Get in Touch</h1>
                    <p className="lead text-muted">We’d love to hear from you!</p>
                </div>

                <Row className="gy-4">
                    {/* Contact Info */}
                    <Col md={5}>
                        <Card className="p-4 shadow-sm border-0">
                            <h3 className="fw-bold text-dark mb-4">Contact Information</h3>
                            
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-envelope text-warning fs-3 me-3"></i>
                                <div>
                                    <p className="mb-0 text-muted">Email</p>
                                    <p className="fw-bold">support@TurkNazz.com</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-telephone text-warning fs-3 me-3"></i>
                                <div>
                                    <p className="mb-0 text-muted">Phone</p>
                                    <p className="fw-bold">000</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <i className="bi bi-geo-alt text-warning fs-3 me-3"></i>
                                <div>
                                    <p className="mb-0 text-muted">Address</p>
                                    <p className="fw-bold">London</p>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Contact Form */}
                    <Col md={7}>
                        <Card className="p-4 shadow-sm border-0">
                            <h3 className="fw-bold text-dark mb-4">Send Us a Message</h3>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Button type="submit" variant="warning" size="lg" className="fw-bold w-100 text-dark">
                                    Send Message
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Contact;
