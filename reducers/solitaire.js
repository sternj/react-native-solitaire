import { shuffle, color, rank, card } from '../helpers/cards';

import { DECK, ACE } from '../constants/cards';

const cardToString = (cardObj) => `${cardObj.pip}: ${cardObj.suit}`
const stackToString = (cardsList) => cardsList.reduce((acc, val) => acc + cardToString(card(val)) + ' ', '')


const ACE_INDICES = DECK.reduce((acc, cardObj ,cardIdx) => {
  if (cardObj.pip === ACE) {
    return acc.concat([cardIdx])
  }
  return acc
}, [])
const DECK_IDX_NO_ACES = DECK.reduce((acc, cardObj, cardIdx) =>  {
  if (cardObj.pip !== ACE) {
    return acc.concat([cardIdx])
  }
  return acc
}, [])
const INITIAL_STATE = {
  cards: DECK,

  // locations
  pickup: [],
  waste: [],

  pile_1: [],
  pile_2: [],
  pile_3: [],
  pile_4: [],
  pile_5: [],
  pile_6: [],
  pile_7: [],

  foundation_1: [],
  foundation_2: [],
  foundation_3: [],
  foundation_4: [],

  // state
  faceup: {}, // { id: true }

  // settings
  wasteSize: 3,
};

// Pile with top 3 cards face up
const INITIAL_STATE2 = {
  ...INITIAL_STATE,
  pile_6: [0,15,27,4,42],
  faceup: {
    27: true,
    4: true,
    42: true
  }
};

// Set up with cards in foundation that can be dragged back to the board
const INITIAL_STATE3 = {
  ...INITIAL_STATE,
  foundation_1: [0,1,2,3],
  pile_6: [30],
  faceup: {
    1: true,
    2: true,
    3: true,
    30: true,
  }
}

// Set up with a large pile
const INITIAL_STATE4 = {
  ...INITIAL_STATE,
  pile_1: [25, 50],
  pile_6: [12, 37, 10, 35, 8, 33, 6, 31, 4, 29, 2, 27, 0],
  faceup: {
    0: true,
    2: true,
    4: true,
    6: true,
    8: true,
    10: true,
    12: true,
    27: true,
    29: true,
    31: true,
    33: true,
    35: true,
    37: true,
    25: true,
    50: true,
  }
}

const createPiles = ([deck, ...rest], pileSize) => {
  if (pileSize <= 0) {
    return [deck, ...rest];
  }

  return createPiles([
    deck.slice(pileSize),
    deck.slice(0, pileSize),
    ...rest
  ], pileSize - 1);
}

const oppositeColors = (card1, card2) => (color(card1.suit) !== color(card2.suit))

const canStack = (card1, card2) => {
  let ret = oppositeColors(card1, card2) && rank(card2.pip) === rank(card1.pip) - 1
  // console.log(`checking ${cardToString(card1)} against ${cardToString(card2)} result ${ret}`)
  // console.log("opposite colors: ", oppositeColors(card1, card2))
  // console.log("rank 2: ", rank(card2.pip))
  // console.log("rank 1: ", rank(card1.pip))
  return ret
}
const getRevealed = (deck) => deck.reduce((acc, val) => {
  if (acc[0].length < 7 && acc[0].filter(x =>  {return (canStack(card(x), card(val)) || canStack(card(val), card(x)))}).length === 0) {
    // console.log("cannot stack")
    // console.log(cardToString(card(val)))
    // console.log("on any of the following")
    // console.log(stackToString(acc[0]))
    // console.log('\n')
    return [acc[0].concat([val]), acc[1]]
  }
  return [acc[0], acc[1].concat([val])]
},[[],[]]) 


const getPool = (revealed, deck, num) => {
  return deck.reduce((acc, val) => {
    if( acc[0].length < num && revealed.filter(x => canStack(card(x), card(val))).length === 0) {
      return [acc[0].concat([val]), acc[1]]
    }
    return [acc[0], acc[1].concat([val])]
  }, [[],[]])
}
const createPilesAdvers = (state = INITIAL_STATE, deck) => {
  let [revealed, remainder] = getRevealed(deck)
  let [pool, hidden] = getPool(revealed, remainder, 24)
  let hiddenWithAces = hidden.concat(ACE_INDICES)
  let newState =  {
    ...state,
    pickup: pool
  }
  for(let i = 1; i <= 7; i++) {
    newState[`pile_${i}`] = hiddenWithAces.slice(0, i-1).concat([revealed[i-1]])
    // console.log(`pile_${i} ${stackToString(newState[`pile_${i}`])}`)
    hiddenWithAces = hiddenWithAces.slice(i-1)
  }
  return newState
}

const solitaire = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'CLEAR_STATE': {
      return {
        ...INITIAL_STATE
      }
    }
    case 'GENERATE_PILES': {
      // NOTE: the LAST card in the pile is the top
      //const cards = state.cards.map((_card, index) => index);
      const shuffledCards = shuffle(DECK_IDX_NO_ACES);
      let newState = createPilesAdvers(state, shuffledCards)
      console.log(cardToString(card(newState.pile_1[0])))
      //const [pickup, ...piles] = createPiles([shuffledCards], 7);
      //console.log(`PILE FOUR FIRST ${state.cards[piles[4][0]].pip} LAST ${state.cards[piles[4][piles[4].length - 1]].pip}`)
      // return {
      //   ...state,
      //   pickup,
      //   pile_1: piles[0],
      //   pile_2: piles[1],
      //   pile_3: piles[2],
      //   pile_4: piles[3],
      //   pile_5: piles[4],
      //   pile_6: piles[5],
      //   pile_7: piles[6],
      // }
      return newState
    }
    case 'FLIP_CARDS_UP': {
      const { ids } = action;
      const { faceup } = state;

      const newFaceUp = ids.reduce((acc, id) =>({
        ...acc,
        [id]: true,
      }), {});

      return {
        ...state,
        faceup: {
          ...faceup,
          ...newFaceUp
        }
      }
    }
    case 'FLIP_CARDS_DOWN': {
      const { ids } = action;
      const { faceup } = state;

      const newFaceUp = ids.reduce((acc, id) =>({
        ...acc,
        [id]: false,
      }), {});

      return {
        ...state,
        faceup: {
          ...faceup,
          ...newFaceUp
        }
      }
    }
    case 'ADD_CARDS_LOCATION': {
      const { ids, location } = action;
      const existingIds = state[location];

      return {
        ...state,
        [location]: [
          ...existingIds,
          ...ids,
        ],
      }
    }
    case 'REMOVE_CARDS_LOCATION': {
      const { ids, location } = action;
      const existingIds = state[location];

      return {
        ...state,
        [location]: existingIds.filter(item => ids.indexOf(item) < 0),
      }
    }
    case 'REMOVE_ALL_CARDS_LOCATION': {
      const { location } = action;
      return {
        ...state,
        [location]: [],
      }
    }
    default: {
      return state;
    }
  }
};

export default solitaire;
