import React from 'react';
import { useNavigate } from "react-router-dom";

const FeaturedRestaurants = () => {
  const navigate = useNavigate();

  const restaurants = [
    {
      name: "TurkNazz Shirley",
      address: "148-150 Stratford Road, B90 3BD",
      image: "https://i.pinimg.com/736x/60/65/6c/60656cdf3d4c402d1ac133195cb5b828.jpg",
      maxSeating: 50
    },
    {
      name: "TurkNazz Moseley",
      address: "107 Alcester Road, B13 8DD",
      image: "https://i.pinimg.com/736x/3c/57/7c/3c577cd2ec4cf36536a3543f77a133b5.jpg",
      maxSeating: 40
    },
    {
      name: "TurkNazz Sutton Coldfield",
      address: "22 Beeches walk, B73 6HN",
      image: "https://i.pinimg.com/736x/c4/45/bd/c445bd941d37902b87a321afed6761ad.jpg",
      maxSeating: 45
    }
  ];

  const handleTableSelect = () => {
    navigate('/menu');
  };

  const handleRestaurantSelect = () => {
    navigate('/booking');
  };

  return (
    <section className="restaurant-locations py-5">
      <div className="container">
        <h2 className="text-center mb-4">Our Locations</h2>
        <div className="row">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100">
                <img 
                  src={restaurant.image} 
                  className="card-img-top" 
                  alt={restaurant.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">{restaurant.address}</p>
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-warning"
                      onClick={handleRestaurantSelect}
                    >
                      Book a Table
                    </button>
                    <button 
                      className="btn btn-dark"
                      onClick={handleTableSelect}
                    >
                      Order Takeaway
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;