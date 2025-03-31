import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/home/styles.css';
import PopularItemsSection from '../components/home/PopularItemsSection';
import TestimonialCarousel from '../components/home/Testimonials';
import FeaturedRestaurants from '../components/home/FeaturedRestaurants';

const Home = () => {
    const navigate = useNavigate();

    const handleBookTableClick = () => {
        navigate('/booking');
    };

    const handleOrderTakeawayClick = () => {
        navigate('/menu');
    };

    return (
        <div className="food-delivery-app">
            <section className="hero text-white position-relative">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-md-6 py-5">
                            <h1 className="display-4 fw-bold mb-3">TurkNazz<br /><span className="text-warning fs-1">Authentic Turkish Cuisine</span></h1>
                            <p className="desc lead mb-4">
                                Enjoy authentic Turkish cuisine from our three convenient locations.
                                Book a table or order delicious takeaway – fresh, flavorful, and just a click away!
                            </p>
                            <div className="d-flex">
                                <button
                                    className="btn btn-warning btn-lg px-4 fw-bold me-3"
                                    onClick={handleBookTableClick}
                                >
                                    Book a Table
                                </button>
                                <button
                                    className="btn btn-outline-light btn-lg px-4 fw-bold"
                                    onClick={handleOrderTakeawayClick}
                                >
                                    Order Takeaway
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <img src="/images/French_Fries.png" alt="Food Delivery" className="img-fluid hero-img" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="food-categories py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-3 mb-4">
                            <div className="category-card rounded p-4 h-100 d-flex align-items-center">
                                <div className="category-icon bg-warning rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                                    <i className="bi bi-search fs-3"></i>
                                </div>
                                <h5 className="ms-3">Browse Our Locations</h5>
                            </div>
                        </div>
                        <div className="col-12 col-md-3 mb-4">
                            <div className="category-card rounded p-4 h-100 d-flex align-items-center">
                                <div className="category-icon bg-warning rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                                    <i className="bi bi-basket fs-3"></i>
                                </div>
                                <h5 className="ms-3">Easy Ordering</h5>
                            </div>
                        </div>
                        <div className="col-12 col-md-3 mb-4">
                            <div className="category-card rounded p-4 h-100 d-flex align-items-center">
                                <div className="category-icon bg-warning rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                                    <i className="bi bi-truck fs-3"></i>
                                </div>
                                <h5 className="ms-3">Fast Delivery</h5>
                            </div>
                        </div>
                        <div className="col-12 col-md-3 mb-4">
                            <div className="category-card rounded p-4 h-100 d-flex align-items-center">
                                <div className="category-icon bg-warning rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                                    <i className="bi bi-star fs-3"></i>
                                </div>
                                <h5 className="ms-3">Rate & Review</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <PopularItemsSection />

            <section className="at-home couple">
                <div className="container" id='at-home-container'>
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <img src="https://i.pinimg.com/736x/f9/65/0e/f9650eea3e945cf305eda995f703541c.jpg" className="img-fluid couple-img" alt="Couple ordering food" />
                        </div>
                        <div className="col-md-6 couple-desc">
                            <h2 className="display-5 enjoy fw-bold">Authentic Turkish Cuisine</h2>
                            <h3 className="display-6 text-warning mb-4">Delivered to Your Door or Dine-In</h3>
                            <p className="res-s mb-4">Experience the finest Turkish flavors at TurkNazz. Whether you’re enjoying a meal at one of our three locations or ordering takeaway, our dishes will transport you straight to Turkey.</p>

                            <div className="row mt-5 find">
                                <div className="col-6 mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="feature-icon bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                                            <i className="bi bi-clock-history text-dark fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-0">Quick & Easy</h5>
                                            <p className="mb-0">Order in Minutes</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="feature-icon bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                                            <i className="bi bi-phone text-dark fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-0">Live Tracking</h5>
                                            <p className="mb-0">Real-time Updates</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="feature-icon bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                                            <i className="bi bi-geo-alt text-dark fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-0">Available at 3 Locations</h5>
                                            <p className="mb-0">Shirley, Moseley, Sutton Coldfield</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="feature-icon bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                                            <i className="bi bi-credit-card text-dark fs-4"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-0">Secure Payment</h5>
                                            <p className="mb-0">Multiple Payment Options</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-warning btn-lg px-4 mt-3">Download App</button>
                        </div>
                    </div>
                </div>
            </section>


            <section className="best-pizza py-5 bg-warning">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 order-md-1 text-center text-md-start">
                            <h2 className="display-5 fw-bold">Get £5 Off<br />Your First<br />Order</h2>
                            <p className="lead mb-4">Use code TURKNAAZZ5 when you place your first order through our website and enjoy £5 off your meal!</p>
                            <button className="btn btn-dark px-4 btn-lg">Start Ordering</button>
                        </div>
                        <div className="col-md-6 order-md-2 text-center">
                            <img src="/images/pizza.png" className="img-fluid" alt="Food Delivery" style={{ width: "100%", maxWidth: "100%", height: "auto" }} />
                        </div>
                    </div>
                </div>
            </section>


            <FeaturedRestaurants />

            <TestimonialCarousel />

            {/* Newsletter */}
            <section className="newsletter py-4 bg-warning">
                <div className="container">
                    <div className="row align-items-center text-center text-lg-start">
                        <div className="col-lg-6 mb-3 mb-lg-0">
                            <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                <i className="bi bi-envelope-open fs-1 me-3"></i>
                                <div>
                                    <p className="mb-0">Get £10 off your next order</p>
                                    <h3 className="fw-bold mb-0">Subscribe to our newsletter for special offers and updates</h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="input-group">
                                <input type="email" className="form-control form-control-lg sub-btn" placeholder="Your email..." />
                                <button className="btn btn-dark btn-lg">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;