// @flow
import React, { Element } from 'react';
import { AppBar, Layout, Panel } from 'react-toolbox';

import EditorPane from './EditorPane';

import styles from './App.scss';

export default (): Element => (
  <Layout className={styles.layout}>
    <Panel className={styles.panel}>
      <AppBar flat>
        <a href="/">Angry Editor</a>
      </AppBar>

      <EditorPane />
    </Panel>
  </Layout>
);
