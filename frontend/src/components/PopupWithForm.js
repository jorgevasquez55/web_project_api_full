import React from "react";
function PopupWithForm(props) {
  return (
    <form
      name={props.name}
      className={`${props.name} ${props.isOpen ? `${props.name}_opened` : ""} `}
      onSubmit={props.onSubmit}
    >
      <div className={`${props.name}__container`}>
        <h2 className={`${props.name}__title`}>{props.title}</h2>
        {props.children}
        <button
          type="button"
          className={`${props.name}__btn-close`}
          onClick={props.onClose}
        ></button>
        <button
          id={`${props.name}-save`}
          type="submit"
          className={
            props.name === "popup-confirm-deletion" 
              ? `${props.name}__btn-delete`
              : `${props.name}__btn-save ${props.isFormValid? "":`${props.name}__btn-save_disabled`}`
          }
        >
          {props.namebutton}
        </button>
      </div>{" "}
      popup-add__btn-save_disabled
    </form>
  );
}
export default PopupWithForm;
