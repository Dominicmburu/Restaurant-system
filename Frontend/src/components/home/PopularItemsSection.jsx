import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/home/popularitem.css';

const foodData = {
  kebabs: [
    {
      id: 1,
      name: "Adana Kebab",
      image: "https://i.pinimg.com/736x/b8/5a/78/b85a78b34d5bf0dd17236240c9f2d387.jpg",
      description: "Juicy minced lamb kebab, grilled to perfection and served with rice and grilled vegetables.",
      price: 14.99,
      rating: 5
    },
    {
      id: 2,
      name: "Chicken Shish Kebab",
      image: "https://i.pinimg.com/736x/99/9a/da/999adae17a774357f4f762261c4c05a8.jpg",
      description: "Succulent marinated chicken cubes grilled on skewers, served with pita bread and a side of salad.",
      price: 12.49,
      rating: 4
    },
    {
      id: 3,
      name: "Lamb Doner",
      image: "https://i.pinimg.com/736x/e2/b3/fd/e2b3fd9dc048e0540fe8ff75ebfcf74a.jpg",
      description: "Tender lamb cooked on a vertical rotisserie, served in a wrap with salad and sauce.",
      price: 13.99,
      rating: 5
    },
    {
      id: 4,
      name: "Chicken Doner",
      image: "https://i.pinimg.com/736x/03/48/a6/0348a61190f963687f7d8e9e3a6068e1.jpg",
      description: "Deliciously seasoned chicken served with pita bread, fresh veggies, and your choice of sauce.",
      price: 11.99,
      rating: 4
    }
  ],
  pizzas: [
    {
      id: 5,
      name: "Turkish Lahmacun",
      image: "https://i.pinimg.com/736x/77/51/c6/7751c6b45b2cce7607fc9c0ec15c2d5a.jpg",
      description: "A traditional Turkish flatbread with minced lamb, vegetables, and spices, a perfect savory delight.",
      price: 9.99,
      rating: 5
    },
    {
      id: 6,
      name: "Turkish Pide",
      image: "https://i.pinimg.com/736x/c8/65/d0/c865d029b4df63f37b1eaf53b527b864.jpg",
      description: "A Turkish-style pizza with a soft, thin crust, topped with your choice of meat, cheese, and vegetables.",
      price: 14.49,
      rating: 5
    },
    {
      id: 7,
      name: "Cheese Pide",
      image: "https://i.pinimg.com/736x/7c/d8/a7/7cd8a72daffef00a6269a9aae69f8080.jpg",
      description: "A cheese-filled Turkish pide, served hot and crispy, a perfect choice for cheese lovers.",
      price: 12.99,
      rating: 4
    },
    {
      id: 8,
      name: "Su Böreği",
      image: "https://i.pinimg.com/736x/ab/3e/0d/ab3e0d2162fff9ec4212c69e46d5bb2e.jpg",
      description: "A traditional Turkish pastry made with layers of dough, cheese, and herbs, often served as a light meal.",
      price: 8.99,
      rating: 5
    }
  ],
  mezes: [
    {
      id: 9,
      name: "Hummus",
      image: "https://i.pinimg.com/736x/b6/07/b8/b607b8e01c40928a4d46e9abff687519.jpg",
      description: "A creamy, flavorful spread made from chickpeas, tahini, garlic, and lemon juice.",
      price: 5.99,
      rating: 5
    },
    {
      id: 10,
      name: "Baba Ghanoush",
      image: "https://i.pinimg.com/736x/e5/68/68/e56868e5e18ec25558e0aba4e8217369.jpg",
      description: "A smoky, tangy dip made from roasted eggplant, tahini, garlic, and olive oil.",
      price: 6.49,
      rating: 4
    },
    {
      id: 11,
      name: "Feta Cheese Salad",
      image: "https://i.pinimg.com/736x/14/0f/56/140f5627f12fd4593b64bc419393e029.jpg",
      description: "A fresh and tangy salad made with feta cheese, olives, tomatoes, cucumbers, and a lemony dressing.",
      price: 7.99,
      rating: 4
    },
    {
      id: 12,
      name: "Sigara Böreği",
      image: "https://i.pinimg.com/736x/2a/4d/51/2a4d5196d8f4309c20c9f31bb37d6877.jpg",
      description: "Crispy, fried pastry rolls filled with feta cheese and spinach.",
      price: 6.99,
      rating: 5
    }
  ],
  desserts: [
    {
      id: 13,
      name: "Baklava",
      image: "https://i.pinimg.com/736x/18/bb/0b/18bb0bd33415bd27e99a66c9d5cb5e4c.jpg",
      description: "A sweet and flaky pastry filled with chopped nuts and sweet syrup, a Turkish classic.",
      price: 4.99,
      rating: 5
    },
    {
      id: 14,
      name: "Künefe",
      image: "https://i.pinimg.com/736x/58/d6/43/58d643bf15e8bba67c97041931a1b446.jpg",
      description: "A warm dessert made from shredded filo dough, filled with sweet cheese, and soaked in syrup.",
      price: 6.49,
      rating: 5
    },
    {
      id: 15,
      name: "Rice Pudding",
      image: "https://i.pinimg.com/736x/06/ce/7a/06ce7a8fd84c3f8e0a5ca5f403df5403.jpg",
      description: "A creamy, comforting dessert made from rice, milk, and sugar, flavored with vanilla and cinnamon.",
      price: 3.99,
      rating: 4
    },
    {
      id: 16,
      name: "Turkish Delight",
      image: "https://i.pinimg.com/736x/e2/de/46/e2de462ee862d81f7bedf585ff09618e.jpg",
      description: "Soft, chewy candy made with sugar, cornstarch, and flavored with rosewater or lemon.",
      price: 5.49,
      rating: 5
    }
  ]
};

const PopularItemsSection = () => {
  const [activeCategory, setActiveCategory] = useState('kebabs');
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate('/menu');
  };

  const renderStars = (rating) => {
    if (rating === 0) return null;

    return (
      <div className="d-flex justify-content-center mb-2">
        {[...Array(rating)].map((_, index) => (
          <i key={index} className="bi bi-star-fill text-warning"></i>
        ))}
      </div>
    );
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <section className="popular-items py-5 bg-light">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <p className="text-warning">Quick pick</p>
            <h2 className="display-5 fw-bold">TurkNazz Favorites</h2>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-center">
            <ul className="nav nav-pills flex-column flex-md-row w-100">
              <li className="nav-item mx-1 flex-fill">
                <button
                  className={`nav-link text-center w-100 ${activeCategory === 'kebabs' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('kebabs')}
                >
                  Kebabs
                </button>
              </li>
              <li className="nav-item mx-1 flex-fill">
                <button
                  className={`nav-link text-center w-100 ${activeCategory === 'pizzas' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('pizzas')}
                >
                  Pizzas
                </button>
              </li>
              <li className="nav-item mx-1 flex-fill">
                <button
                  className={`nav-link text-center w-100 ${activeCategory === 'mezes' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('mezes')}
                >
                  Mezes
                </button>
              </li>
              <li className="nav-item mx-1 flex-fill">
                <button
                  className={`nav-link text-center w-100 ${activeCategory === 'desserts' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('desserts')}
                >
                  Desserts
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          {foodData[activeCategory].map((item) => (
            <div className="col-md-3 mb-4" key={item.id}>
              <div className="card h-100 border-0 shadow-sm">
                <img src={item.image} className="card-img-top" alt={item.name} />
                <div className="card-body">
                  {renderStars(item.rating)}
                  <h5 className="card-title text-center">{item.name}</h5>
                  <p className="card-text text-center text-muted">{item.description}</p>
                  <p className="text-center fw-bold fs-4">£{item.price.toFixed(2)}</p>
                  <div className="d-grid">
                    <button className="btn btn-warning rounded-pill" onClick={handleBookClick}>Add to cart</button>
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

export default PopularItemsSection;
