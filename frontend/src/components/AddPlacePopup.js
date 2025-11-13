import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [modifiedName, setModifiedName] = useState(false);
  const [modifiedlink, setModifiedLink] = useState(false);
  const [nameErrorVisible, setNameErrorVisible] = useState(false);
  const [linkErrorVisible, setLinkErrorVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlaceSubmit({
      link: link,
      name: name,
    });
    setName("");
    setLink("");
    setModifiedName(false);
    setModifiedLink(false);
    setIsFormValid(false);
    setNameErrorVisible(false);
    setLinkErrorVisible(false);
  }
  const handleNameChange = (e) => {
    setName(e.target.value);
    setModifiedName(true);
  };
  const handleLinkChange = (e) => {
    setLink(e.target.value);
    setModifiedLink(true);
  };
  const linkRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  useEffect(() => {
    if (modifiedName || modifiedlink) {
      setIsFormValid(linkRegex.test(link) && name.length > 0);
      setNameErrorVisible(name.length === 0);
      setLinkErrorVisible(
        modifiedlink && (link.length === 0 || !linkRegex.test(link))
      );
    }
  }, [link, name, modifiedName, modifiedlink]);

  return (
    <div>
      <PopupWithForm 
        isFormValid={isFormValid}
        title="New place"
        name="popup-add"
        namebutton="Guardar"
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          name="name"
          id="popup-add-name"
          className={`popup-add__input ${
            nameErrorVisible ? "popup-add__input_type_error" : ""
          }`}
          placeholder="Title"
          minlength={2}
          required
          value={name}
          onChange={handleNameChange}
        />
        <span
          className={`popup-add__input-error popup-add-name-error ${
            nameErrorVisible ? "popup-add__input-error_active" : ""
          }`}
        >
          Por favor ingrese un nombre válido
        </span>
        <input
          name="link"
          type="url"
          id="popup-add-descripcion"
          className={`popup-add__input ${
            linkErrorVisible ? "popup-add__input_type_error" : ""
          }`}
          placeholder="Imagen URL"
          required
          value={link}
          onChange={handleLinkChange}
        />
        <span
          className={`popup-add__input-error popup-add-descripcion-error ${
            linkErrorVisible ? "popup-add__input-error_active" : ""
          }`}
        >
          Por favor ingrese un enlace válido
        </span>
      </PopupWithForm>
    </div>
  );
}
export default AddPlacePopup;
