import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
function EditAvatarPopup(props) {
  const [link, setLink] = useState("");
  const [modifiedLink, setModifiedLink] = useState(false);
  const [linkErrorVisible, setLinkErrorVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const linkRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: linkRef.current.value,
    });
    setLink("");
    setModifiedLink(false);
    setLinkErrorVisible(false);
    setIsFormValid(false);
  }

  const handleLinkChange = (e) => {
    setLink(e.target.value);
    setModifiedLink(true);
  };
  const linkRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  useEffect(() => {
    if (modifiedLink) {
      setIsFormValid(linkRegex.test(link));
      setLinkErrorVisible(
        modifiedLink && (link.length === 0 || !linkRegex.test(link))
        
      );
    }  
  }, [link, modifiedLink]);

  return (
    <div>
      <PopupWithForm
        isFormValid={isFormValid}
        title="Cambiar foto de perfil"
        name="popup-edit-img"
        namebutton="Guardar"
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          ref={linkRef}
          name="link"
          type="url"
          id="popup-edit-img-descripcion"
          className={`popup-edit-img__input ${
            linkErrorVisible ? "popup-edit-img__input_type_error" : ""
          }`}
          placeholder="URL"
          required
          onChange={handleLinkChange}
          
        />
        <span 
        className={`popup-edit-img__input-error popup-edit-img-descripcion-error ${
          linkErrorVisible ? "popup-edit-img__input-error_active" : ""   
        }`}
        >
          por favor ingrese un enlace correcto
        </span>
        
        
      </PopupWithForm>
    </div>
  );
}
export default EditAvatarPopup;
