import React from "react";
import GenericHeader from "./GenericHeader";
import { NavLink } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext";

function HeaderMain(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const email = currentUser && currentUser.email;
  function signOut() {
    localStorage.removeItem("token");
    props.handleLogin(null);
  }
  return (
    <GenericHeader>
      <h1 className="header__email">{email}</h1>
      <NavLink exact className="header__titulo" to="/signin" onClick={signOut}>
        Cerrar sesión
      </NavLink>
    </GenericHeader>
  );
}

export default HeaderMain;
