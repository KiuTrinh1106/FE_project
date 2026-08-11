// chứa api liên quan đến user/ account

import api from "./api";

const userService = {
  getAll() {
    return api.get("/User/getAll");
  },

  getById(id) {
    return api.get(`/User/${id}`);
  },

  create(data) {
    return api.post("/User/create", data);
  },

  update(data) {
    return api.put("/User/update", data);
  },

  deleteById(id) {
    return api.delete(`/User/${id}`);
  },
};

export default userService;
