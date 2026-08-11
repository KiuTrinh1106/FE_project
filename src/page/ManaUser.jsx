import React, { useState, useEffect } from 'react';
import userService from '../services/userServices';

function ManaUser() {
    const [users, setUsers] = useState([]);


    // STATE QUẢN LÝ FORM (Dùng chung cho cả Thêm mới và Sửa)
    const [formData, setFormData] = useState({
        userId: '',
        username: '',
        password: '',
        email: '',
        fullName: '',
        phone: '',
        role: 'STUDENT',
        status: 'ACTIVE'
    });

    // State để biết đang ở chế độ "Thêm mới" hay "Sửa" (true = Đang sửa)
    const [isEditing, setIsEditing] = useState(false);

    // lấy danh sách người dùng từ BE
    const fetchUsers = async () => {
        try {
            const response = await userService.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('LỖI', error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    // Xử lý khi gõ vào các ô input của Form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Hàm bấm nút LƯU (Xử lý cả Thêm và Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn trang web bị reload khi submit form

        try {
            if (isEditing) {
                await userService.update(formData);
                alert('Cập nhật thành công!');
            } else {
                await userService.create(formData);
                alert('Thêm account thành công!');
            }

            // Làm mới lại bảng và xóa trắng form
            fetchUsers();
            resetForm();
        } catch (error) {
            console.error('LỖI LƯU DATA:', error);
            alert('Có lỗi xảy ra, vui lòng kiểm tra lại!');
        }
    };


    // Hàm bấm nút XÓA ở từng dòng
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa account này?")) {
            try {
                await userService.deleteById(id);
                alert("Xóa thành công!");
                fetchUsers(); // Load lại danh sách sau khi xóa
            } catch (error) {
                console.error('LỖI XÓA USER:', error);
                alert("Có lỗi xảy ra khi xóa!");
            }
        }
    };

    // Hàm bấm nút SỬA ở từng dòng -> Đưa dữ liệu lên Form
    const handleEditClick = (user) => {
        setIsEditing(true);
        setFormData({
            userId: user.userId || user.user_id,
            username: user.username || '',
            password: user.password || '',
            email: user.email || '',
            fullName: user.fullName || user.full_name || '',
            phone: user.phone || '',
            role: user.role || 'STUDENT',
            status: user.status || 'ACTIVE'
        });
    };

    // Hàm Hủy/Xóa trắng form
    const resetForm = () => {
        setIsEditing(false);
        setFormData({
            userId: '',
            username: '',
            password: '',
            email: '',
            fullName: '',
            phone: '',
            role: 'STUDENT',
            status: 'ACTIVE'
        });
    };

    // 2. Hàm xử lý đổi trạng thái ACTIVE <-> BANNED (Nút Switch ON/OFF)
    /* const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
        try {
            // VD: Gọi API cập nhật status của BE Java (bạn sửa lại link API cho đúng với BE nhé)
            await axios.put(`http://localhost:8888/User/updateStatus/${user.userId}`, {
                status: newStatus
            });
            
            // Cập nhật lại danh sách sau khi đổi thành công
            fetchUsers();
        } catch (error) {
            console.error('LỖI ĐỔI TRẠNG THÁI:', error);
            alert('Không thể cập nhật trạng thái!');
        }
    };*/
    
    return(
        <div className="container-fluid mt-4">
            <h1>Hệ thống Quản lý Người dùng</h1>

            {/* ================= PHẦN FORM THÊM / SỬA ACCOUNT ================= */}
            <div className="card my-4">
                <div className="card-header">
                    <strong>{isEditing ? 'Sửa thông tin Account' : 'Thêm Account mới'}</strong>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isEditing} // Thường sửa thì ko cho sửa username
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!isEditing} // Thêm mới thì bắt buộc, sửa thì tùy
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Họ và tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Vai trò (Role)</label>
                                <select
                                    className="form-select"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="STUDENT">STUDENT</option>
                                    <option value="EMPLOYER">EMPLOYER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Trạng thái (Status)</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="BANNED">BANNED</option>
                                </select>
                            </div>

                            {/* CÁC NÚT BẤM CỦA FORM */}
                            <div className="col-md-3 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary me-2">
                                    {isEditing ? 'Cập nhật' : '+ Thêm mới'}
                                </button>
                                {isEditing && (
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Hủy
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* ================= PHẦN BẢNG DANH SÁCH ================= */}
            <table className="table table-hover mt-3 border">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center">Chưa có dữ liệu</td>
                        </tr>
                    ) : (
                        users.map((acc) => (
                            <tr key={acc.userId || acc.user_id}>
                                <td>{acc.userId || acc.user_id}</td>
                                <td>{acc.username}</td>
                                <td>{acc.fullName || acc.full_name}</td>
                                <td>{acc.email}</td>
                                <td>{acc.phone}</td>
                                <td>{acc.role}</td>
                                <td>{acc.status}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEditClick(acc)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(acc.userId || acc.user_id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ManaUser;