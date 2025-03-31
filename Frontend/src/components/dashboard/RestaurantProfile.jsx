import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tab, Nav, Spinner, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RestaurantProfile = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState('menu');



    const restaurantData = {
        'burger-house': {
            id: 'burger-house',
            name: 'Burger House',
            description: 'Home of London\'s most delicious gourmet burgers. Our handcrafted burgers are made with 100% prime beef and served with fresh, locally-sourced ingredients.',
            cuisine: 'Burgers',
            location: 'Camden, London',
            deliveryFee: 2.50,
            minOrder: 10.00,
            rating: 4.7,
            reviewCount: 243,
            deliveryTime: '25-35',
            openingHours: '11:00 AM - 10:00 PM',
            address: '123 Camden High Street, London NW1 7JR',
            phone: '+44 20 1234 5678',
            tags: ['Burgers', 'American', 'Fast Food', 'Family Friendly'],
            image: 'https://i.pinimg.com/236x/3d/d4/a9/3dd4a9302cb0dc3756e83d20cecc1bc6.jpg',
            heroImage: 'https://i.pinimg.com/236x/3d/d4/a9/3dd4a9302cb0dc3756e83d20cecc1bc6.jpg',
            menu: [
                {
                    category: 'Signature Burgers',
                    items: [
                        { id: 'b1', name: 'Classic Cheeseburger', description: 'Beef patty, cheddar cheese, lettuce, tomato, pickles, and our special sauce', price: 9.99, popular: true, image: 'https://i.pinimg.com/564x/ff/77/43/ff7743fe9c691ef9d26c04fb6dc45fca.jpg' },
                        { id: 'b2', name: 'BBQ Bacon Burger', description: 'Beef patty, bacon, cheddar cheese, BBQ sauce, and crispy onion rings', price: 12.99, popular: true, image: 'https://i.pinimg.com/564x/13/c0/2b/13c02bf6c44c9a9fa0ae28cb3a99de26.jpg' },
                        { id: 'b3', name: 'Mushroom Swiss Burger', description: 'Beef patty, Swiss cheese, sautéed mushrooms, and truffle aioli', price: 11.99, popular: false, image: 'https://i.pinimg.com/564x/49/69/14/4969144595e022be3d24de8e41bd5a9b.jpg' },
                        { id: 'b4', name: 'Veggie Deluxe', description: 'Plant-based patty, vegan cheese, avocado, lettuce, tomato, and vegan mayo', price: 10.99, popular: false, image: 'https://i.pinimg.com/564x/a9/0d/34/a90d34a9ccd69d878bfa7cb728c33a42.jpg' },
                    ]
                },
                {
                    category: 'Sides',
                    items: [
                        { id: 's1', name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce, bacon bits, and green onions', price: 5.99, popular: true, image: 'https://i.pinimg.com/564x/d2/a8/41/d2a8415d5d1c729caff8ca7f55f7ebe0.jpg' },
                        { id: 's2', name: 'Onion Rings', description: 'Beer-battered onion rings served with house dipping sauce', price: 4.99, popular: false, image: 'https://i.pinimg.com/564x/01/5a/8d/015a8dc96c62e61b2e57ef6da3b2dd9f.jpg' },
                        { id: 's3', name: 'Sweet Potato Fries', description: 'Crispy sweet potato fries with chipotle mayo', price: 4.99, popular: false, image: 'https://i.pinimg.com/564x/8b/78/5e/8b785e5fcd9040af303f98a597d1a342.jpg' },
                    ]
                },
                {
                    category: 'Drinks',
                    items: [
                        { id: 'd1', name: 'Classic Milkshake', description: 'Choose from vanilla, chocolate, or strawberry', price: 4.99, popular: true, image: 'https://i.pinimg.com/564x/09/6a/a8/096aa8c0a7e6d99461db3a31387c38bc.jpg' },
                        { id: 'd2', name: 'Craft Soda', description: 'Locally made artisan sodas in various flavors', price: 2.99, popular: false, image: 'https://i.pinimg.com/564x/b5/28/ba/b528ba43871f78e6073d8b9895f6125c.jpg' },
                        { id: 'd3', name: 'Iced Tea', description: 'Freshly brewed and lightly sweetened', price: 2.49, popular: false, image: 'https://i.pinimg.com/564x/c7/9b/2e/c79b2e16f1e4cffa5c0fa13bd5a55012.jpg' },
                    ]
                }
            ],
            reviews: [
                { id: 'r1', user: 'Alex M.', rating: 5, date: '2025-03-01', comment: 'Best burgers in London! The Classic Cheeseburger is to die for.' },
                { id: 'r2', user: 'Sarah T.', rating: 4, date: '2025-02-15', comment: 'Great food and fast delivery. The fries were a bit cold but still tasty.' },
                { id: 'r3', user: 'James L.', rating: 5, date: '2025-02-10', comment: 'The BBQ Bacon Burger is incredible. Will definitely order again!' },
                { id: 'r4', user: 'Emma W.', rating: 4, date: '2025-01-28', comment: 'Delicious veggie burger, you wouldn\'t know it\'s plant-based. Delivery was prompt.' },
            ]
        },
        'sushiteria': {
            id: 'sushiteria',
            name: 'Sushiteria',
            description: 'Contemporary Japanese cuisine featuring the freshest ingredients. Our expert chefs blend traditional techniques with modern innovation for an unforgettable dining experience.',
            cuisine: 'Asian food',
            location: 'Soho, London',
            deliveryFee: 3.00,
            minOrder: 15.00,
            rating: 4.8,
            reviewCount: 189,
            deliveryTime: '35-45',
            openingHours: '12:00 PM - 11:00 PM',
            address: '45 Old Compton Street, London W1D 5JY',
            phone: '+44 20 9876 5432',
            tags: ['Japanese', 'Sushi', 'Asian', 'Healthy'],
            image: 'https://i.pinimg.com/736x/44/e6/ba/44e6bae24b7e4bb2f8a686bf0d69740f.jpg',
            heroImage: 'https://i.pinimg.com/originals/34/4a/20/344a209e9cdcd31da59466f82aa29a59.jpg',
            menu: [
                {
                    category: 'Signature Rolls',
                    items: [
                        { id: 's1', name: 'Dragon Roll', description: 'Shrimp tempura, avocado, topped with thinly sliced avocado and eel sauce', price: 14.99, popular: true, image: 'https://i.pinimg.com/564x/98/2a/a6/982aa67a5c6f2a8a23c0eabc0baf92f5.jpg' },
                        { id: 's2', name: 'Rainbow Roll', description: 'California roll topped with assorted sashimi, avocado, and tobiko', price: 15.99, popular: true, image: 'https://i.pinimg.com/564x/01/53/1e/01531e70b5d152fa318e5f5303e7e56c.jpg' },
                        { id: 's3', name: 'Spicy Tuna Roll', description: 'Fresh tuna, spicy mayo, cucumber, and spring onion', price: 11.99, popular: false, image: 'https://i.pinimg.com/564x/d9/30/47/d93047bdd860ff7cab12c1c5ec35a55d.jpg' },
                    ]
                },
                {
                    category: 'Sashimi',
                    items: [
                        { id: 'sa1', name: 'Salmon Sashimi', description: '6 pieces of fresh salmon sashimi', price: 12.99, popular: true, image: 'https://i.pinimg.com/564x/58/48/8d/58488d839313b7a4f56d44135bf4176c.jpg' },
                        { id: 'sa2', name: 'Tuna Sashimi', description: '6 pieces of premium bluefin tuna', price: 16.99, popular: false, image: 'https://i.pinimg.com/564x/65/12/e1/6512e19a3f13b4a947890d48d881458e.jpg' },
                        { id: 'sa3', name: 'Sashimi Platter', description: 'Chef\'s selection of premium fish (12 pieces)', price: 24.99, popular: true, image: 'https://i.pinimg.com/564x/db/06/f0/db06f0e5a68ef04702e23a923aae5265.jpg' },
                    ]
                },
                {
                    category: 'Hot Dishes',
                    items: [
                        { id: 'h1', name: 'Chicken Katsu Curry', description: 'Breaded chicken cutlet with Japanese curry sauce and steamed rice', price: 13.99, popular: true, image: 'https://i.pinimg.com/564x/ae/a7/d8/aea7d8cd88136aaee56f973541f97e23.jpg' },
                        { id: 'h2', name: 'Vegetable Tempura', description: 'Assorted vegetables in a light, crispy batter with dipping sauce', price: 9.99, popular: false, image: 'https://i.pinimg.com/564x/36/db/98/36db98232a7cb1ab4b24eaadc3ccf315.jpg' },
                        { id: 'h3', name: 'Teriyaki Salmon', description: 'Grilled salmon glazed with teriyaki sauce, served with steamed rice', price: 15.99, popular: false, image: 'https://i.pinimg.com/564x/41/57/a0/4157a0c9d2a6a9f9dd67da74bcf0d329.jpg' },
                    ]
                }
            ],
            reviews: [
                { id: 'r1', user: 'Oliver P.', rating: 5, date: '2025-03-05', comment: 'Freshest sushi in London! The Dragon Roll was amazing.' },
                { id: 'r2', user: 'Nina K.', rating: 5, date: '2025-02-20', comment: 'Authentic Japanese flavors. Worth every penny!' },
                { id: 'r3', user: 'David M.', rating: 4, date: '2025-02-12', comment: 'Great food but delivery took a bit longer than expected.' },
                { id: 'r4', user: 'Sophie L.', rating: 5, date: '2025-01-30', comment: 'The sashimi platter is incredible. So fresh and beautifully presented.' },
            ]
        },
        'happy-grill': {
            id: 'happy-grill',
            name: 'Happy Grill',
            description: 'Authentic BBQ experience with the finest cuts of meat slow-cooked to perfection. Our signature marinades and house-made sauces create a flavor explosion for true BBQ lovers.',
            cuisine: 'BBQ',
            location: 'Shoreditch, London',
            deliveryFee: 2.80,
            minOrder: 12.00,
            rating: 4.6,
            reviewCount: 167,
            deliveryTime: '30-40',
            openingHours: '12:00 PM - 10:30 PM',
            address: '78 Rivington Street, London EC2A 3AY',
            phone: '+44 20 3456 7890',
            tags: ['BBQ', 'Grill', 'American', 'Meat Lovers'],
            image: 'https://i.pinimg.com/736x/39/9e/7d/399e7d0df89cd4babb1971c7b5ac062b.jpg',
            heroImage: 'https://i.pinimg.com/736x/39/9e/7d/399e7d0df89cd4babb1971c7b5ac062b.jpg',
            menu: [
                {
                    category: 'BBQ Specialties',
                    items: [
                        { id: 'bbq1', name: 'Beef Brisket', description: 'Slow-smoked for 12 hours with our signature dry rub (200g)', price: 14.99, popular: true, image: 'https://i.pinimg.com/564x/cf/a2/25/cfa225fe50d3fb2c0fe542f0717bd288.jpg' },
                        { id: 'bbq2', name: 'Baby Back Ribs', description: 'Tender pork ribs glazed with our house BBQ sauce (half rack)', price: 16.99, popular: true, image: 'https://i.pinimg.com/564x/f2/34/f7/f234f77abcbafe8d90dc97a4c7c6e26a.jpg' },
                        { id: 'bbq3', name: 'Pulled Pork', description: 'Slow-cooked pulled pork with Carolina-style sauce (180g)', price: 12.99, popular: false, image: 'https://i.pinimg.com/564x/b9/df/6d/b9df6d85e9e0f10c9914858b4ab0c477.jpg' },
                    ]
                },
                {
                    category: 'Platters',
                    items: [
                        { id: 'p1', name: 'BBQ Combo Platter', description: 'Brisket, ribs, and pulled pork with two sides', price: 24.99, popular: true, image: 'https://i.pinimg.com/564x/0c/57/91/0c5791cda5e22af2baecd4f1a48e7068.jpg' },
                        { id: 'p2', name: 'Family Feast', description: 'Feeds 3-4: Assorted meats and sides with cornbread', price: 49.99, popular: false, image: 'https://i.pinimg.com/564x/d1/e9/3d/d1e93d70ae2373aa57b4adcf443f46ce.jpg' },
                        { id: 'p3', name: 'Veggie Grill Platter', description: 'Grilled vegetables, halloumi, and portobello mushrooms with two sides', price: 16.99, popular: false, image: 'https://i.pinimg.com/564x/00/ce/02/00ce02bf6aca1200252bf663599732dc.jpg' },
                    ]
                },
                {
                    category: 'Sides',
                    items: [
                        { id: 's1', name: 'Mac & Cheese', description: 'Creamy three-cheese macaroni', price: 4.99, popular: true, image: 'https://i.pinimg.com/564x/e3/81/00/e38100438ca52e85c39319241f99cfba.jpg' },
                        { id: 's2', name: 'Coleslaw', description: 'House-made creamy coleslaw', price: 3.99, popular: false, image: 'https://i.pinimg.com/564x/1c/89/2c/1c892c5d4c31caca5c2307b4b1c11814.jpg' },
                        { id: 's3', name: 'Cornbread', description: 'Sweet honey cornbread with butter', price: 3.99, popular: true, image: 'https://i.pinimg.com/564x/98/09/a0/9809a0802a2c396b9d330429128b067c.jpg' },
                    ]
                }
            ],
            reviews: [
                { id: 'r1', user: 'Michael B.', rating: 5, date: '2025-03-10', comment: 'The best BBQ I\'ve had outside of Texas! The brisket was perfect.' },
                { id: 'r2', user: 'Olivia S.', rating: 4, date: '2025-02-25', comment: 'Delicious food, generous portions. The mac & cheese side is amazing!' },
                { id: 'r3', user: 'Thomas R.', rating: 5, date: '2025-02-05', comment: 'Those ribs are incredible! Fall-off-the-bone tender and perfect sauce.' },
                { id: 'r4', user: 'Charlotte H.', rating: 4, date: '2025-01-20', comment: 'Great BBQ. Delivery was quick and everything was still hot.' },
            ]
        }
    };

    useEffect(() => {
        // Simulate API fetch
        setLoading(true);
        setTimeout(() => {
            setRestaurant(restaurantData[id]);
            setLoading(false);
        }, 800);
    }, [id]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
            } else if (i - 0.5 <= rating) {
                stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
            } else {
                stars.push(<i key={i} className="bi bi-star text-warning"></i>);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="warning" className="my-5" />
                <p>Loading restaurant details...</p>
            </Container>
        );
    }

    if (!restaurant) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    Restaurant not found. Please check the URL and try again.
                </Alert>
            </Container>
        );
    }

    return (
        <div className="restaurant-details">
            {/* Hero Section */}
            <div className="restaurant-hero position-relative" style={{ height: '350px', overflow: 'hidden' }}>
                <div
                    className="hero-image w-100 h-100"
                    style={{
                        backgroundImage: `url(${restaurant.heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.7)'
                    }}
                />
                <div className="position-absolute bottom-0 start-0 w-100 text-white p-4"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                    <Container>
                        <Row className="align-items-end">
                            <Col md={8}>
                                <h1 className="display-4 fw-bold mb-0">{restaurant.name}</h1>
                                <div className="d-flex align-items-center mt-2">
                                    <span className="me-3">
                                        {renderStars(restaurant.rating)}
                                        <span className="ms-2">{restaurant.rating}</span>
                                        <span className="text-muted ms-1">({restaurant.reviewCount} reviews)</span>
                                    </span>
                                    <span className="me-3">
                                        <i className="bi bi-clock me-1"></i>
                                        {restaurant.deliveryTime} min
                                    </span>
                                    <span>
                                        <i className="bi bi-currency-pound me-1"></i>
                                        {restaurant.deliveryFee.toFixed(2)} delivery
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <Badge bg="warning" text="dark" className="me-1">
                                        <i className="bi bi-tag-fill me-1"></i>
                                        {restaurant.cuisine}
                                    </Badge>
                                    {restaurant.tags.slice(0, 3).map((tag, index) => (
                                        <Badge key={index} bg="light" text="dark" className="me-1">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </Col>
                            <Col md={4} className="d-flex justify-content-md-end mt-3 mt-md-0">
                                <Button variant="warning" className="px-4 text-dark fw-bold">
                                    <i className="bi bi-heart me-2"></i>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            <Container className="py-4">
                <Row>
                    <Col lg={8}>
                        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                            <div className="mb-4 border-bottom">
                                <Nav variant="tabs" className="border-0">
                                    <Nav.Item>
                                        <Nav.Link eventKey="menu" className="border-0 px-4">
                                            <i className="bi bi-list me-2"></i>Menu
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="reviews" className="border-0 px-4">
                                            <i className="bi bi-star me-2"></i>Reviews
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="info" className="border-0 px-4">
                                            <i className="bi bi-info-circle me-2"></i>Info
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>

                            <Tab.Content>
                                <Tab.Pane eventKey="menu">
                                    <div className="mb-4">
                                        <Form.Control
                                            type="text"
                                            placeholder="Search menu items..."
                                            className="mb-4"
                                        />

                                        {restaurant.menu.map((category, index) => (
                                            <div key={index} className="mb-5">
                                                <h3 className="mb-3">{category.category}</h3>
                                                <div className="row">
                                                    {category.items.map((item) => (
                                                        <div key={item.id} className="col-lg-6 mb-3">
                                                            <Card className="h-100 border shadow-sm hover-effect">
                                                                <Row className="g-0">
                                                                    <Col xs={4} style={{ overflow: 'hidden' }}>
                                                                        <div
                                                                            className="h-100"
                                                                            style={{
                                                                                backgroundImage: `url(${item.image})`,
                                                                                backgroundSize: 'cover',
                                                                                backgroundPosition: 'center',
                                                                                minHeight: '120px'
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col xs={8}>
                                                                        <Card.Body className="p-3">
                                                                            <div className="d-flex justify-content-between align-items-start">
                                                                                <div>
                                                                                    <Card.Title className="mb-1 fs-5">{item.name}</Card.Title>
                                                                                    {item.popular && (
                                                                                        <Badge bg="danger" pill className="mb-2">
                                                                                            <i className="bi bi-star-fill me-1"></i>Popular
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <span className="fw-bold">£{item.price.toFixed(2)}</span>
                                                                            </div>
                                                                            <Card.Text className="small text-muted mb-3">
                                                                                {item.description}
                                                                            </Card.Text>
                                                                        </Card.Body>
                                                                    </Col>
                                                                </Row>
                                                            </Card>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Tab.Pane>

                                <Tab.Pane eventKey="reviews">
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="me-4">
                                                <h2 className="mb-0">{restaurant.rating}</h2>
                                                <div>
                                                    {renderStars(restaurant.rating)}
                                                </div>
                                                <p className="text-muted">{restaurant.reviewCount} reviews</p>
                                            </div>
                                            <div className="ms-4 flex-grow-1">
                                                <div className="d-flex align-items-center mb-1">
                                                    <span className="me-2">5</span>
                                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                        <div className="progress-bar bg-warning" style={{ width: '70%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center mb-1">
                                                    <span className="me-2">4</span>
                                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                        <div className="progress-bar bg-warning" style={{ width: '20%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center mb-1">
                                                    <span className="me-2">3</span>
                                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                        <div className="progress-bar bg-warning" style={{ width: '5%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center mb-1">
                                                    <span className="me-2">2</span>
                                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                        <div className="progress-bar bg-warning" style={{ width: '3%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="me-2">1</span>
                                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                        <div className="progress-bar bg-warning" style={{ width: '2%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reviews list */}
                                        <div className="reviews-list">
                                            {restaurant.reviews.map((review) => (
                                                <Card key={review.id} className="mb-3 border shadow-sm">
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <h5 className="mb-0">{review.user}</h5>
                                                            <span className="text-muted">{new Date(review.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="mb-2">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <p className="mb-0">{review.comment}</p>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>

                                        {/* Write a review button */}
                                        <div className="text-center mt-4">
                                            <Button variant="outline-warning" className="px-4">
                                                <i className="bi bi-pencil me-2"></i>
                                                Write a Review
                                            </Button>
                                        </div>
                                    </div>
                                </Tab.Pane>

                                <Tab.Pane eventKey="info">
                                    <div className="mb-4">
                                        <Row>
                                            <Col md={7}>
                                                <Card className="border shadow-sm p-3">
                                                    <Card.Body>
                                                        <h5 className="mb-3">Restaurant Info</h5>
                                                        <p className="mb-2">
                                                            <i className="bi bi-geo-alt me-2"></i> {restaurant.address}
                                                        </p>
                                                        <p className="mb-2">
                                                            <i className="bi bi-telephone me-2"></i> {restaurant.phone}
                                                        </p>
                                                        <p className="mb-2">
                                                            <i className="bi bi-clock me-2"></i> Open: {restaurant.openingHours}
                                                        </p>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={5}>
                                                <iframe
                                                    title="Restaurant Location"
                                                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
                                                        restaurant.address
                                                    )}`}
                                                    width="100%"
                                                    height="250"
                                                    style={{ border: 0, borderRadius: '8px' }}
                                                    allowFullScreen
                                                ></iframe>
                                            </Col>
                                        </Row>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default RestaurantProfile;
