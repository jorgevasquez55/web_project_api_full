import Api from "../components/Api.js";
const token = localStorage.getItem("token");
const api = new Api({
  address: "https://around-jorge.abrdns.com/",
  token: token,
});
export default api;
