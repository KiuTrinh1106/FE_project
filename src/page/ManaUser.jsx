import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import userService from '../services/userServices';

function ManaUser() {
    const { t } = useTranslation();
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
    // để lưu thông báo lỗi:
    const [errors, setErrors] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: ''
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
        // Cập nhật dữ liệu form
        /* setFormData({
            ...formData,
            [name]: value
        }); */
        setFormData((previousFormData) => ({
        ...previousFormData,
        [name]: value
        }));

        // Kiểm tra lỗi ngay khi gõ
        const errorMessage = validateField(name, value);

        // lưu hoặc xóa thông báo lỗi
        setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: errorMessage
        }));

    };

    // Hàm kiểm tra lỗi
    const validateField = (name, value) => {
    const trimmedValue = value.trim();

    switch (name) {
        case 'username':
            if (!trimmedValue) {
                return 'Tên đăng nhập không được để trống';
            }

            if (trimmedValue.length < 4) {
                return 'Tên đăng nhập phải có ít nhất 4 ký tự';
            }

            if (/\s/.test(value)) {
                return 'Tên đăng nhập không được chứa khoảng trắng';
            }

            return '';

        case 'password':
            if (!isEditing && !value) {
                return 'Mật khẩu không được để trống';
            }

            if (value && value.length < 6) {
                return 'Mật khẩu phải có ít nhất 6 ký tự';
            }

            return '';

        case 'fullName':
            if (!trimmedValue) {
                return 'Họ và tên không được để trống';
            }

            if (trimmedValue.length < 2) {
                return 'Họ và tên phải có ít nhất 2 ký tự';
            }

            return '';

        case 'email':
            if (!trimmedValue) {
                return 'Email không được để trống';
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
                return 'Email không đúng định dạng';
            }

            return '';

        case 'phone':
            if (
                trimmedValue &&
                !/^(0|\+84)[0-9]{9}$/.test(trimmedValue)
            ) {
                return 'Số điện thoại không đúng định dạng';
            }

            return '';

        default:
            return '';
    }
};

    // Hàm bấm nút LƯU (Xử lý cả Thêm và Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn trang web bị reload khi submit form
        const nextErrors = {
        username: validateField('username', formData.username),
        password: validateField('password', formData.password),
        email: validateField('email', formData.email),
        fullName: validateField('fullName', formData.fullName),
        phone: validateField('phone', formData.phone),
        };

setErrors(nextErrors);

const hasError = Object.values(nextErrors).some(Boolean);
if (hasError) return;

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
            <h1>{t('userManagement.title')}</h1>

            {/* ================= PHẦN FORM THÊM / SỬA ACCOUNT ================= */}
            <div className="card my-4">
                <div className="card-header">
                    <strong>{isEditing ? t('userManagement.form.editTitle') : t('userManagement.form.createTitle')}</strong>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">{t('userManagement.form.username')}</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isEditing} 
                                />
                                {errors.username && (
                                <div className="invalid-feedback">
                                {errors.username}
                            </div>
)}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('userManagement.form.password')}</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!isEditing} 
                                />
                                {errors.password && (
                                    <div className="invalid-feedback">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('userManagement.form.fullName')}</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.fullName && (
                                    <div className="invalid-feedback">
                                        {errors.fullName}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('userManagement.form.email')}</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('userManagement.form.phone')}</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                {errors.phone && (
                                    <div className="invalid-feedback">
                                        {errors.phone}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">{t('userManagement.form.role')}</label>
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
                                <label className="form-label">{t('userManagement.form.status')}</label>
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
                                    {isEditing ? t('userManagement.form.submit') : `+ ${t('userManagement.form.createTitle')}`}
                                </button>
                                {isEditing && (
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        {t('userManagement.form.cancel')}
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
                        <th>{t('userManagement.table.id')}</th>
                        <th>{t('userManagement.table.username')}</th>
                        <th>{t('userManagement.table.fullName')}</th>
                        <th>{t('userManagement.table.email')}</th>
                        <th>{t('userManagement.table.phone')}</th>
                        <th>{t('userManagement.table.role')}</th>
                        <th>{t('userManagement.table.status')}</th>
                        <th>{t('userManagement.table.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center">{t('userManagement.noData')}</td>
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
                                        {t('userManagement.actions.edit')}
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(acc.userId || acc.user_id)}
                                    >
                                        {t('userManagement.actions.delete')}
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