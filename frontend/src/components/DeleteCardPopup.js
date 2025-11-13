import React from "react";
import PopupWithForm from "./PopupWithForm";
function DeleteCardPopup(props) {
  function handleSubmit(e) {
    e.preventDefault();
    props.handleCardDelete();
    props.onClose();
  }
  return (
    <div>
      <PopupWithForm
        title="¿Estás seguro?"
        name="popup-confirm-deletion"
        namebutton="si"
        isOpen={props.statuspopupConfirmation}
        onClose={props.onClose}
        onSubmit={handleSubmit}
        noValidate
      />
    </div>
  );
}
export default DeleteCardPopup;
