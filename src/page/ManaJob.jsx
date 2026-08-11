import { useTranslation } from "react-i18next";

function ManJob() {
    const { t } = useTranslation();

    return(
        <div className="container mt-4">
            <h1>{t("job.title")}</h1>
            <p>{t("job.description")}</p>
        </div>
    );
}

export default ManJob;