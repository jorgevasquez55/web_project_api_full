import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";
function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);
  const nameUser = currentUser && currentUser.name;
  const aboutUser = currentUser && currentUser.about;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modifiedDescription, setModifiedDescription] = useState(false);
  const [modifiedName, setModifiedName] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [nameErrorVisible,setNameErrorVisible]= useState(false);
  const [descriptionErrorVisible,setDescriptionErrorVisible]= useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      about: description, 
      name: name,
    });
  }
  const handleNameChange = (e) => {
    setName(e.target.value);
    setModifiedName(true);
  };
  const handleAboutChange = (e) => {
    setDescription(e.target.value);
    setModifiedDescription(true);
  };
  
  useEffect(() => { 
    if (!modifiedName) {
      setName(nameUser || "");
    }
    if (!modifiedDescription) {
      setDescription(aboutUser || "");
    }
    if (modifiedName || modifiedDescription) {
      setIsFormValid(name.length > 0 && description.length > 0 );
      setNameErrorVisible(modifiedName && name.length === 0  );
      setDescriptionErrorVisible(modifiedDescription && description.length === 0);
    }

  }, [name, description, modifiedName, modifiedDescription]);

  return (
    <div>
      <PopupWithForm
        isFormValid={isFormValid}
        title="Edit profile"
        name="popup"
        namebutton="Guardar"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      >
        <input
          name="name"
          id="popup-name"
          className={`popup__input ${
            nameErrorVisible ? "popup__input_type_error" : ""
          }`}
          placeholder="Nombre"
          minlength={2}
          maxlength={40}
          required
          value={name}
          onChange={handleNameChange}
        />
        <span className={`popup__input-error popup-name-error ${
            nameErrorVisible ? "popup__input-error_active" : ""
          }`}>
            Ingrese bien el nombre
        </span>

        <input
          name="about"
          id="popup-description"
          className={`popup__input ${
            descriptionErrorVisible ? "popup__input_type_error" : ""
          }`}
          placeholder="Acerca de mi"
          minlength={2}
          maxlength={200}
          required
          value={description}
          onChange={handleAboutChange}
        />
        <span className={`popup__input-error popup-description-error ${
            descriptionErrorVisible ? "popup__input-error_active" : ""
          }`}>
            Ingrese bien la descripcion
        </span>
      </PopupWithForm>
    </div>
  );
}
export default EditProfilePopup;
