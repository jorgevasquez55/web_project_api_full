import React, { useState, useEffect } from "react";
import Card from "./Card";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import DeleteCardPopup from "./DeleteCardPopup.js";
function Main({
  onEditProfileClick,
  onAddPlaceClick,
  onEditAvatarClick,
  ontrashCard, 
  cardStatus,
  oncardImg,
  onClose,
  cards,
  onCardLike,
  statuspopupConfirmation,
  handleCardData,
  handleCardDelete,
  isHovered,
  setIsHovered,
}) {
  const currentUser = React.useContext(CurrentUserContext);
  const avatarUrl = currentUser && currentUser.avatar;
  const userName = currentUser && currentUser.name;
  const userDescription = currentUser && currentUser.about;
  
  return (
    <main className="container">
      <section className="profile">
        <div className="profile__content" style={{ backgroundImage: `url(${avatarUrl})` }} onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}>
          <div className={`profile__content-fond ${isHovered ? "profile__content-fond_opened" : ""}`}>
            <button className="profile__btn-edit" onClick={onEditAvatarClick}></button>
          </div>
        </div>
        <div className="profile__info">
          <h2 className="profile__subtitle">{userName}</h2>
          <button onClick={onEditProfileClick} className="edit-button edit-button_action_add"></button>
          <p id="profiletext" className="profile__text">
            {userDescription}
          </p>
        </div>
        <button onClick={onAddPlaceClick} className="add-button"></button>
      </section>
      <section className="elements">
        <div className="cards">
          {cards.map((card) => (
            <Card
            key={card._id}
              ontrashCard={ontrashCard}
              onCardLike={onCardLike}
              card={card}
              handleCardData={handleCardData}
              oncardImg={oncardImg}
            />
          ))}
        </div>
        {cardStatus !== null ? (<ImagePopup selectedCard={cardStatus} onClose={onClose} />) : null}
        
        {statuspopupConfirmation !== null ? (
          <DeleteCardPopup
            handleCardDelete={handleCardDelete}
            statuspopupConfirmation={statuspopupConfirmation}
            onClose={onClose}
          />
        ) : null}
      </section>
    </main>
  );
}
export default Main;
