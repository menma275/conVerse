// hooks/useCardState.js
import { useState, useCallback } from "react";

export const useCardState = () => {
  const [allCards, setAllCards] = useState([]);
  const [loadedData, setLoadedData] = useState(false);

  const handleReceiveNewCardData = useCallback((newCard) => {
    console.log("New Card:", newCard);
    setAllCards((prevCards) => {
      const cardIndex = prevCards.findIndex((card) => card.postId === newCard.postId);
      if (cardIndex === -1) {
        return [...prevCards, newCard];
      } else {
        return prevCards.map((card) => (card.postId === newCard.postId ? newCard : card));
      }
    });
  }, []);

  const handleReceiveData = (newData) => {
    setAllCards(() => newData);
    setLoadedData(true);
  };

  return {
    allCards,
    loadedData,
    handleReceiveNewCardData,
    handleReceiveData,
  };
};
