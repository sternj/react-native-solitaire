const applyToArray = (array, func) => array.map(item => func(item));

/*
  CREATION ACTIONS
*/

export const createCards = cards => ({
  type: 'CREATE_CARDS',
  cards,
});

export const generatePiles = () => ({
  type: 'GENERATE_PILES'
});

export const generateDeck = () => ({
  type: 'GENERATE_DECK'
});

export const shuffleDeck = () => ({
  type: 'SHUFFLE_DECK'
});

/*
  FLIP CARDS
*/

export const flipFirstCardUpInPiles = () => (dispatch, getState) => {
  const { solitaire } = getState();
  const { piles } = solitaire;

  piles.map(pile => {
    const firstCard = pile[pile.length - 1];
    dispatch(flipCardUp(firstCard));
  });
};

export const flipCardsUp = ids => dispatch => applyToArray(ids, (id => dispatch(flipCardUp(id))));
export const flipCardUp = id => ({
  type: 'FLIP_CARD_UP',
  id,
});

export const flipCardsDown = ids => dispatch => applyToArray(ids, (id => dispatch(flipCardDown(id))));
export const flipCardDown = id => ({
  type: 'FLIP_CARD_DOWN',
  id,
});

/*
  MOVE CARDS
*/

export const movePickupIntoWaste = () => (dispatch, getState) => {
  const { solitaire } = getState();
  const { pickup, wasteSize } = solitaire;

  if(pickup.length === 0) {
    dispatch(moveWasteIntoPickup());
    return;
  }

  const cards = pickup.slice(0, wasteSize);

  dispatch(removeCardsPickup(cards));
  dispatch(addCardsWaste(cards));
  dispatch(flipCardsUp(cards));
};

export const moveWasteIntoPickup = () => (dispatch, getState) => {
  const { solitaire } = getState();
  const { waste } = solitaire;

  dispatch(removeAllCardsWaste());
  dispatch(flipCardsDown(waste));
  dispatch(addCardsPickup(waste));
};


/* ADD REMOVE CARDS */

export const addCardWaste = id => dispatch => dispatch(addCardsWaste([id]));
export const addCardsWaste = ids => ({
  type: 'ADD_CARDS_WASTE',
  ids
});

export const removeAllCardsWaste = () => ({
  type: 'REMOVE_ALL_CARDS_WASTE'
});
export const removeCardsWaste = ids => dispatch => applyToArray(ids, (id => dispatch(removeCardWaste(id))));
export const removeCardWaste = id => ({
  type: 'REMOVE_CARD_WASTE',
  id
});

export const addCardPickup = id => dispatch => dispatch(addCardsPickup([id]));
export const addCardsPickup = ids => ({
  type: 'ADD_CARDS_PICKUP',
  ids
});

export const removeAllCardsPickup = () => ({
  type: 'REMOVE_ALL_CARDS_PICKUP'
});
export const removeCardsPickup = ids => dispatch => applyToArray(ids, (id => dispatch(removeCardPickup(id))));
export const removeCardPickup = id => ({
  type: 'REMOVE_CARD_PICKUP',
  id
});