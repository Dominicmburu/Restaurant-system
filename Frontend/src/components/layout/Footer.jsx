import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="footer bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-4">
              <div className="bg-warning d-inline-block text-dark p-2 rounded">
                <h3 className="mb-0">TurkNazz</h3>
              </div>
              <p className="mt-3">Bringing authentic Turkish cuisine to your door from our three locations: Shirley, Moseley, and Sutton Coldfield.</p>
            </div>
          </div>
          <div className="row justify-content-center text-center mb-4">
            <div className="col-12">
              <button className="btn btn-warning btn-lg text-dark rounded-pill">
                <i className="bi bi-telephone-fill me-2"></i>
                Order now
              </button>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <div className="d-flex justify-content-center mb-4">
                <a href="#" className="text-warning mx-2"><i className="bi bi-twitter fs-4"></i></a>
                <a href="#" className="text-warning mx-2"><i className="bi bi-facebook fs-4"></i></a>
                <a href="#" className="text-warning mx-2"><i className="bi bi-instagram fs-4"></i></a>
                <a href="#" className="text-warning mx-2"><i className="bi bi-youtube fs-4"></i></a>
              </div>
              <p className="mb-0">TurkNazz &copy; 2025 - All Rights Reserved</p>
              <div className="mt-3">
                <Link to="/login" className="text-warning text-decoration-none">
                  Manage Restaurant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="position-fixed bottom-0 end-0 p-3">
        <button className="btn btn-warning rounded-circle p-3" id="goTopBtn" onClick={scrollToTop}>
          <i className="bi bi-arrow-up"></i>
        </button>
      </div>
    </>
  );
};

export default Footer;