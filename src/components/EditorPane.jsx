import React, { Component } from 'react';
import {
  Editor,
  EditorState,
  Entity,
  Modifier,
  convertToRaw,
} from 'draft-js';

import styles from './EditorPane.css';

export default class EditorPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.handleChange = ::this.handleChange;
    this.insertBloodlust = ::this.insertBloodlust;
    this.logRaw = ::this.logRaw;
    this.logState = ::this.logState;
  }

  handleChange(editorState) {
    this.setState({ editorState });
  }

  insertBloodlust() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const entityKey = Entity.create('icon', 'IMMUTABLE', {
      iconClass: 'spell_nature_bloodlust',
    });

    const iconReplacedContent = Modifier.replaceText(
      contentState,
      selectionState,
      ' ',
      null,
      entityKey,
    );

    const newEditorState = EditorState.push(
      editorState,
      iconReplacedContent,
      'insert-icon',
    );

    this.setState({
      editorState: EditorState.forceSelection(
        newEditorState,
        iconReplacedContent.getSelectionAfter(),
      ),
    });
  }

  logRaw() {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  logState() {
    console.log(this.state.editorState.toJS());
  }

  render() {
    const { editorState } = this.state;

    return (
      <div>
        <div className={styles.debugButtons}>
          <button onClick={this.logRaw}>Log Raw</button>
          <button onClick={this.logState}>Log State</button>
          <button onClick={this.insertBloodlust}>Bloodlust</button>
        </div>

        <div className={styles.editor}>
          <Editor
            editorState={editorState}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}
