import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            <h1>404</h1>

            <h2>Không tìm thấy trang</h2>

            <p>
                Đường dẫn bạn đang truy cập không tồn tại.
            </p>

            <Link to="/">
                Quay về trang chủ
            </Link>
        </div>
    );
}

export default NotFound;