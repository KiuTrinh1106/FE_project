import { useEffect, useState } from "react";
import jobService from "../services/jobServices";

const initialFormData = {
  jobId: "",
  title: "",
  companyId: "",
  salary: "",
  quantityPositions: "",
  workTime: "",
  detailedAddress: "",
  expiredAt: "",
  jobStatus: "OPEN",
  hideStatus: false,
  description: "",
  requirements: "",
};

function ManaJob() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [hideFilter, setHideFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await jobService.getAll();
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      console.error("Lỗi tải danh sách công việc:", requestError);
      setError("Không thể tải danh sách công việc. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: name === "hideStatus" ? value === "true" : value,
    }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
    setIsEditing(false);
    setFormData(initialFormData);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Bạn chưa nhập tiêu đề công việc.");
      return false;
    }

    if (!formData.companyId) {
      alert("Bạn chưa nhập mã công ty.");
      return false;
    }

    if (!formData.detailedAddress.trim()) {
      alert("Bạn chưa nhập địa chỉ chi tiết.");
      return false;
    }

    if (!formData.description.trim()) {
      alert("Bạn chưa nhập mô tả công việc.");
      return false;
    }

    return true;
  };

  const buildPayload = () => ({
    ...formData,
    jobId: formData.jobId ? Number(formData.jobId) : null,
    title: formData.title.trim(),
    companyId: Number(formData.companyId),
    salary: formData.salary.trim(),
    quantityPositions: formData.quantityPositions
      ? Number(formData.quantityPositions)
      : null,
    workTime: formData.workTime.trim(),
    detailedAddress: formData.detailedAddress.trim(),
    expiredAt: formData.expiredAt || null,
    hideStatus: Boolean(formData.hideStatus),
    description: formData.description.trim(),
    requirements: formData.requirements.trim(),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEditing && !validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = buildPayload();

      if (isEditing) {
        await jobService.update(payload);
        alert("Cập nhật trạng thái công việc thành công!");
      } else {
        await jobService.create(payload);
        alert("Thêm công việc thành công!");
      }

      setShowModal(false);
      setIsEditing(false);
      setFormData(initialFormData);
      await fetchJobs();
    } catch (requestError) {
      console.error("Lỗi lưu công việc:", requestError);
      alert("Có lỗi xảy ra khi lưu công việc. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (jobId) => {
    try {
      const response = await jobService.getById(jobId);
      const job = response.data;

      setFormData({
        jobId: job.jobId,
        title: job.title || "",
        companyId: job.companyId || "",
        salary: job.salary || "",
        quantityPositions: job.quantityPositions || "",
        workTime: job.workTime || "",
        detailedAddress: job.detailedAddress || "",
        expiredAt: job.expiredAt ? job.expiredAt.substring(0, 16) : "",
        jobStatus: job.jobStatus || "OPEN",
        hideStatus: Boolean(job.hideStatus),
        description: job.description || "",
        requirements: job.requirements || "",
      });

      setIsEditing(true);
      setShowModal(true);
    } catch (requestError) {
      console.error("Lỗi lấy chi tiết công việc:", requestError);
      alert("Không thể lấy thông tin công việc.");
    }
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa công việc này? Hành động này không thể hoàn tác!",
    );

    if (!confirmed) return;

    try {
      await jobService.deleteById(jobId);
      alert(`Đã xóa thành công công việc`);
      await fetchJobs();
    } catch (requestError) {
      console.error("Lỗi xóa công việc:", requestError);
      alert("Xóa thất bại, dữ liệu có thể đang bị ràng buộc!");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const title = job.title?.toLowerCase() || "";
    const address = job.detailedAddress?.toLowerCase() || "";

    const matchesKeyword =
      !normalizedKeyword ||
      title.includes(normalizedKeyword) ||
      address.includes(normalizedKeyword);
    const matchesStatus = !statusFilter || job.jobStatus === statusFilter;
    const matchesHide =
      hideFilter === "" || job.hideStatus === (hideFilter === "true");

    return matchesKeyword && matchesStatus && matchesHide;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (safeCurrentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage,
  );

  return (
    <main className="container-fluid mt-4">
      <h1 className="mb-4">
        Hệ thống Quản lý Công việc (Jobs){" "}
        <span className="badge badge-info" style={{ fontSize: 14 }}>
          ADMIN/EMPLOYER
        </span>
      </h1>

      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Bộ lọc tìm kiếm</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-5 mb-2">
              <label className="font-weight-bold">Từ khóa</label>
              <input
                className="form-control"
                placeholder="Tìm theo tiêu đề hoặc địa chỉ..."
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-3 mb-2">
              <label className="font-weight-bold">Trạng thái công việc</label>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả</option>
                <option value="OPEN">OPEN (Đang mở)</option>
                <option value="CLOSED">CLOSED (Đã đóng)</option>
                <option value="EXPIRED">EXPIRED (Hết hạn)</option>
              </select>
            </div>
            <div className="col-md-3 mb-2">
              <label className="font-weight-bold">Trạng thái hiển thị</label>
              <select
                className="form-control"
                value={hideFilter}
                onChange={(event) => {
                  setHideFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tất cả</option>
                <option value="false">Đang hiển thị</option>
                <option value="true">Đã ẩn</option>
              </select>
            </div>
            <div className="col-md-1 mb-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                title="Xóa bộ lọc"
                onClick={() => {
                  setKeyword("");
                  setStatusFilter("");
                  setHideFilter("");
                  setCurrentPage(1);
                }}
              >
                Xóa lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Danh sách Công việc</h5>
          <button type="button" className="btn btn-success" onClick={handleOpenCreate}>
            + Đăng việc mới
          </button>
        </div>

        {error && (
          <div className="alert alert-danger m-3 d-flex justify-content-between">
            <span>{error}</span>
            <button type="button" className="btn btn-sm btn-danger" onClick={fetchJobs}>
              Thử lại
            </button>
          </div>
        )}

        <div className="card-body p-0" style={{ overflowX: "auto" }}>
          <table className="table table-hover mb-0">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Công ty ID</th>
                <th>Mức lương</th>
                <th>Số lượng</th>
                <th>Hạn nộp</th>
                <th>Trạng thái</th>
                <th>Hiển thị</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-4">Đang tải dữ liệu...</td></tr>
              ) : filteredJobs.length === 0 ? (
                <tr><td colSpan="9" className="text-center text-muted py-4">Không tìm thấy dữ liệu</td></tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr key={job.jobId}>
                    <td>{job.jobId}</td>
                    <td>
                      <strong>{job.title}</strong><br />
                      <small className="text-muted">{job.detailedAddress}</small>
                    </td>
                    <td>{job.companyId}</td>
                    <td>{job.salary || "Thỏa thuận"}</td>
                    <td>{job.quantityPositions || "KXĐ"}</td>
                    <td>{job.expiredAt ? new Date(job.expiredAt).toLocaleString("vi-VN") : "Không có"}</td>
                    <td>
                      <span className={`badge ${job.jobStatus === "OPEN" ? "badge-success" : job.jobStatus === "CLOSED" ? "badge-secondary" : "badge-dark"}`}>
                        {job.jobStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${job.hideStatus ? "badge-warning" : "badge-info"}`}>
                        {job.hideStatus ? "Đã ẩn" : "Đang hiển thị"}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button type="button" className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(job.jobId)}>
                        Sửa
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(job.jobId)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredJobs.length > 0 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mr-2"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              >
                Trước
              </button>

              <span>
                Trang {safeCurrentPage} / {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-outline-primary btn-sm ml-2"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
            {/* THAY ĐỔI: Sử dụng modal-lg thay cho modal-xl để form gọn gàng hơn */}
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      {isEditing ? "Chỉnh sửa Trạng thái Công việc" : "Thêm mới Công việc"}
                    </h5>
                    <button type="button" className="close text-white" onClick={handleCloseModal} disabled={isSubmitting}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-9 form-group mb-2">
                        <label htmlFor="jobTitle">Tiêu đề công việc <span className="text-danger">*</span></label>
                        <input id="jobTitle" type="text" className="form-control form-control-sm" name="title" value={formData.title} onChange={handleInputChange} disabled={isEditing} placeholder="VD: Thực tập sinh Java Backend" />
                      </div>
                      <div className="col-md-3 form-group mb-2">
                        <label htmlFor="jobCompanyId">Mã công ty <span className="text-danger">*</span></label>
                        <input id="jobCompanyId" type="number" min="1" className="form-control form-control-sm" name="companyId" value={formData.companyId} onChange={handleInputChange} disabled={isEditing} />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 form-group mb-2">
                        <label htmlFor="jobSalary">Mức lương</label>
                        <input id="jobSalary" type="text" className="form-control form-control-sm" name="salary" value={formData.salary} onChange={handleInputChange} disabled={isEditing} placeholder="VD: 5.000.000 - 10.000.000 VNĐ" />
                      </div>
                      <div className="col-md-4 form-group mb-2">
                        <label htmlFor="jobQuantity">Số lượng tuyển</label>
                        <input id="jobQuantity" type="number" min="1" className="form-control form-control-sm" name="quantityPositions" value={formData.quantityPositions} onChange={handleInputChange} disabled={isEditing} />
                      </div>
                      <div className="col-md-4 form-group mb-2">
                        <label htmlFor="jobWorkTime">Thời gian làm việc</label>
                        <input id="jobWorkTime" type="text" className="form-control form-control-sm" name="workTime" value={formData.workTime} onChange={handleInputChange} disabled={isEditing} placeholder="Part-time / Full-time" />
                      </div>
                    </div>

                    <div className="form-group mb-2">
                      <label htmlFor="jobAddress">Địa chỉ chi tiết <span className="text-danger">*</span></label>
                      <input id="jobAddress" type="text" className="form-control form-control-sm" name="detailedAddress" value={formData.detailedAddress} onChange={handleInputChange} disabled={isEditing} />
                    </div>

                    <div className="row">
                      <div className="col-md-4 form-group mb-2">
                        <label htmlFor="jobExpiredAt">Hạn chót nộp hồ sơ</label>
                        <input id="jobExpiredAt" type="datetime-local" className="form-control form-control-sm" name="expiredAt" value={formData.expiredAt} onChange={handleInputChange} disabled={isEditing} />
                      </div>
                      <div className="col-md-4 form-group mb-2">
                        <label htmlFor="jobStatus">Trạng thái công việc</label>
                        <select id="jobStatus" className="form-control form-control-sm" name="jobStatus" value={formData.jobStatus} onChange={handleInputChange}>
                          <option value="OPEN">OPEN (Đang mở)</option>
                          <option value="CLOSED">CLOSED (Đã đóng)</option>
                          <option value="EXPIRED">EXPIRED (Hết hạn)</option>
                        </select>
                      </div>
                      <div className="col-md-4 form-group mb-2">
                        <label htmlFor="jobHideStatus">Trạng thái hiển thị</label>
                        <select id="jobHideStatus" className="form-control form-control-sm" name="hideStatus" value={String(formData.hideStatus)} onChange={handleInputChange}>
                          <option value="false">Công khai</option>
                          <option value="true">Đã ẩn</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group mb-2">
                      <label htmlFor="jobDescription">Mô tả công việc <span className="text-danger">*</span></label>
                      {/* THAY ĐỔI: rows="2" để textarea bớt dài */}
                      <textarea id="jobDescription" className="form-control form-control-sm" name="description" value={formData.description} onChange={handleInputChange} disabled={isEditing} rows="2" />
                    </div>
                    <div className="form-group mb-0">
                      <label htmlFor="jobRequirements">Yêu cầu công việc</label>
                      {/* THAY ĐỔI: rows="2" để textarea bớt dài */}
                      <textarea id="jobRequirements" className="form-control form-control-sm" name="requirements" value={formData.requirements} onChange={handleInputChange} disabled={isEditing} rows="2" />
                    </div>
                  </div>

                  <div className="modal-footer pb-2 pt-2">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleCloseModal} disabled={isSubmitting}>Đóng</button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                      {isSubmitting ? "Đang lưu..." : "Lưu dữ liệu"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </main>
  );
}

export default ManaJob;
