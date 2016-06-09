import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

import 'draft-js/dist/Draft.css';
import styles from './EditorPane.css';

export default class EditorPane extends Component {
  constructor(props) {
    super(props);

    this.handleChange = ::this.handleChange;
  }

  state = {
    editorState: EditorState.createEmpty(),
  };

  handleChange(editorState) {
    this.setState({ editorState });
  }

  render() {
    const { editorState } = this.state;

    return (
      <div className={styles.editorContainer}>
        <Editor
          editorState={editorState}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
