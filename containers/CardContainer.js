import React from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';

import { cardClicked } from '../actions';

const CardContainer = (props) => <Card {...props} />

const mapStateToProps = (state, props) => {
  const { id } = props;
  const { solitaire } = state;
  const card = solitaire.cards[id];
  const isFaceUp = solitaire.faceup[id] === true;
  const isSelected = solitaire.selected[id];

  return ({
    ...props,
    card,
    isFaceUp,
    isSelected,
  });
};

const mapDispatchToProps = (dispatch) => ({
  onCardClick: payload => dispatch(cardClicked(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardContainer);