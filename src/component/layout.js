import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Layout() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };

  return (
    <>
      <header className="header bg-dark text-white p-3 d-flex justify-content-between">
        <div className="d-flex">
          <div className="item center-vertical mx-3">
            <Link to="/" className="text-white text-decoration-none">
              {t("nav.home")}
            </Link>
          </div>
          <div className="item center-vertical mx-3">
            <Link to="/users" className="text-white text-decoration-none">
              {t("nav.users")}
            </Link>
          </div>
          <div className="item center-vertical mx-3">
            <Link to="/company" className="text-white text-decoration-none">
              {t("nav.company")}
            </Link>
          </div>
          <div className="item center-vertical mx-3">
            <Link to="/jobs" className="text-white text-decoration-none">
              {t("nav.jobs")}
            </Link>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-light btn-sm me-3" onClick={toggleLanguage}>
            {i18n.language === "vi" ? t("language.english") : t("language.vietnamese")}
          </button>
          <div
            className="item-end center-vertical mx-3"
            onClick={() => {
              // Handle logout logic here
            }}
            style={{ cursor: "pointer" }}
          >
            {t("nav.logout")}
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}

export default Layout;
