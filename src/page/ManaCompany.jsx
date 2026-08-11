import { useTranslation } from "react-i18next";

function ManaCompany() {
    const { t } = useTranslation();

    return(
        <div className="container mt-4">
            <h1>{t("company.title")}</h1>
            <p>{t("company.description")}</p>
        </div>
    );
}

export default ManaCompany;