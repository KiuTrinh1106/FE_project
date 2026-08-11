import { useTranslation } from "react-i18next";

function HomePage() {
    const { t } = useTranslation();

    return (
        <div className="container mt-4">
            <h1>{t("home.title")}</h1>
            <p>{t("home.description")}</p>
        </div>
    );
}

export default HomePage;