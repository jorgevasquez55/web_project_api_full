import React, { useContext} from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({
  ontrashCard,
  onCardLike,
  card,
  handleCardData,
  oncardImg,
}) {
  const { _id, name, likes, link, owner } = card;
  const currentUser = useContext(CurrentUserContext);    
  const isOwn = currentUser ?._id === owner;      
const isLiked = currentUser && likes.some((i) => i._id === currentUser._id);

  const cardDeleteButtonClassName = `card__btn-trash ${isOwn ? "card__btn-trash_visible" : "card__btn-trash_hidden"}`;
  const cardLikeButtonClassName = `card__btn-love ${isLiked ? "card__btn-love_activate" : ""}`;

  function handleLikeClick() {
    onCardLike(card);
  }
  function handleDeleteClick() {
    ontrashCard();
    handleCardData(card);
  }
  function handleImgCard() {
    oncardImg({ link: link });    
  }
  return (
    <div key={_id} className="card">
      <button className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
      <img src={link} className="card__image" alt={`Imagen de un hermoso paisaje llamado ${name}`} onClick={handleImgCard}/>
      <h2 className="card__subtitle"> {name} </h2>
      <div className="card__contet">
        <button className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
        <h3 className="card__like-number">{likes && likes.length ? likes.length : 0}</h3>
      </div>
    </div>
  );
}
export default Card;
