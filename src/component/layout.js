import HomePage from "../page/Home";
import ManaUser from "../page/ManaUser";
import { Routes, Route, Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <header className="header bg-dark text-white p-3 d-flex justify-content-between">
        <div className="d-flex">
          <div className="item center-vertical mx-3">
            <a href="./home.html" className="text-white text-decoration-none">
              Home
            </a>
          </div>
          <div className="item center-vertical mx-3">
            <Link to="/users" className="text-white text-decoration-none">
              User Management
            </Link>
          </div>
          <div className="item center-vertical mx-3">
            <Link to="/company" className="text-white text-decoration-none">
              Company Management
            </Link>
          </div>
          <div className="item center-vertical mx-3">
            <Link to="/jobs" className="text-white text-decoration-none">
              Job Management
            </Link>
          </div>
        </div>
        <div
          className="item-end center-vertical mx-3"
          onClick={() => {
            // Handle logout logic here
          }}
          style={{ cursor: "pointer" }}
        >
          Logout
        </div>
      </header>
      <Outlet />
    </>
  );
}

export default Layout;
