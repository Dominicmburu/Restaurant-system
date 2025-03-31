import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ open, onClose }) => {
  return (
    <div className={`offcanvas offcanvas-start ${open ? "show" : ""}`} tabIndex="-1">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Admin Panel</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        <ul className="list-group">
          <li className="list-group-item">
            <Link to="/dashboard" className="text-decoration-none">Dashboard</Link>
          </li>
          <li className="list-group-item">
            <Link to="/dashboard/bookings" className="text-decoration-none">Manage Bookings</Link>
          </li>
          <li className="list-group-item">
            <Link to="/dashboard/orders" className="text-decoration-none">Manage Orders</Link>
          </li>
          <li className="list-group-item">
            <Link to="/dashboard/analytics" className="text-decoration-none">Analytics</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
