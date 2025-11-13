import React from "react";
function ImagePopup({ selectedCard, onClose }) {
  return (
    <div className={`big-picture ${selectedCard ? "big-picture_opened" : ""}`}>
      <div className="big-picture__content">
        <img src={selectedCard.link} className="big-picture__image-normal" alt={`Una imagen muy hermosa del lugar${selectedCard.name}`}/>  
        <h2 className="big-picture__lugar">{selectedCard.name}</h2>
        <button className="big-picture__btn-close" onClick={onClose}></button>
      </div>
    </div>
  );
}
export default ImagePopup;
