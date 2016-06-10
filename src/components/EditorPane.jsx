import React, { Component } from 'react';
import {
  CompositeDecorator,
  EditorState,
  Entity,
  Modifier,
  convertToRaw,
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import 'draft-js/dist/Draft.css';
import styles from './EditorPane.css';

const findIconEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();

    return (
      entityKey !== null &&
      Entity.get(entityKey).getType() === 'icon'
    );
  }, callback);
};

const Icon = ({ entityKey }) => {
  const { iconClass } = Entity.get(entityKey).getData();

  return (
    <img
      alt={`{icon ${iconClass}}`}
      className={iconClass}
      style={{
        height: '25px',
        width: '25px',
      }}
    />
  );
};

export default class EditorPane extends Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      { strategy: findIconEntities, component: Icon },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
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
        </div>

        <div className={styles.editorContainer}>
          <div className={styles.editorToolbar}>
            <button onClick={this.insertBloodlust}>Bloodlust</button>
          </div>

          <Editor
            editorState={editorState}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}
