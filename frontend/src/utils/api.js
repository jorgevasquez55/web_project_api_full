import Api from "../components/Api.js";
const token = localStorage.getItem("token");
const api = new Api({
  address: "https://api.aroundeua.aroundproject.cloudns.be/",
  token: token,
});
export default api;