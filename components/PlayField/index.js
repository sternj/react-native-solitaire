import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import SpreadPile from '../SpreadPile';

export default class PlayField extends React.Component {
  render() {
    const { piles } = this.props;

    return (
      <View style={styles.playField}>
        {piles.map((pile, index) => <SpreadPile key={index} pile={pile} />)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  playField: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: Dimensions.get('window').width,
  },
});