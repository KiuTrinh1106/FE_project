import api from "./api";

const jobService = {
  getAll() {
    return api.get("/Job/getAll");
  },

  getById(id) {
    return api.get(`/Job/${id}`);
  },

  create(data) {
    return api.post("/Job/create", data);
  },

  update(data) {
    return api.put("/Job/update", data);
  },

  deleteById(id) {
    return api.delete(`/Job/delete/${id}`);
  },
};

export default jobService;
