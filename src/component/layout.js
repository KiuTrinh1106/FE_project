import HomePage from "../page/Home";
import ManaUser from "../page/ManaUser";
import { Routes, Route, Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <header class="header bg-dark text-white p-3 d-flex justify-content-between">
        <div class="d-flex">
          <div class="item center-vertical mx-3">
            <a href="./home.html" class="text-white text-decoration-none">
              Home
            </a>
          </div>
          <div class="item center-vertical mx-3">
            <Link to="/users" class="text-white text-decoration-none">
              User Management
            </Link>
          </div>
          <div class="item center-vertical mx-3">
            <Link to="/company" class="text-white text-decoration-none">
              Company Management
            </Link>
          </div>
          <div class="item center-vertical mx-3">
            <Link to="/jobs" class="text-white text-decoration-none">
              Job Management
            </Link>
          </div>
        </div>
        <div
          class="item-end center-vertical mx-3"
          onclick="logout()"
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
