import React, { Fragment } from 'react';

import Layout from './Layout';

import SetDragContainer from '../containers/SetDragContainer';

import Nav from '../components/Nav';
import OffField from '../components/OffField';
import PlayField from '../components/PlayField';
import SelectedCards from '../components/SelectedCards';

const GameScreen = () =>
  <Fragment>
    <Layout>
      <Nav />
      <SetDragContainer>
        <Fragment>
          <OffField />
          <PlayField />
        </Fragment>
      </SetDragContainer>
    </Layout>
    <SelectedCards />
  </Fragment>

export default GameScreen;
