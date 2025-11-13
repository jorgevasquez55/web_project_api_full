import React from "react";
import logo from "../images/logo.png";

function GenericHeader(props) {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="Logo de empresa tripleten"
      />
      {props.children}
    </header>
  );
}

export default GenericHeader;
