// @flow
import {
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';
import React, { Component, Element } from 'react';

import addIcon from '../draft/modifiers/addIcon';
import convertToAngry from '../draft/convertToAngry';
import findEntitiesByType from '../draft/findEntitiesByType';

import Icon from './Icon';
import Toolbar from './Toolbar';

import styles from './EditorPane.scss';

class EditorPane extends Component {
  constructor() {
    super();

    const decorator: CompositeDecorator = new CompositeDecorator([
      {
        strategy: findEntitiesByType('icon'),
        component: Icon.fromEntity,
      },
    ]);

    const contentState: ContentState = this.createInitialContentState();

    this.state = {
      editorState: EditorState.createWithContent(contentState, decorator),
      editMode: true,
      hasUnsavedChanges: false,
    };

    this.addIcon = this.addIcon.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommonIconClick = this.handleCommonIconClick.bind(this);
    this.handleEditModeToggle = this.handleEditModeToggle.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.hasUnsavedChanges = this.hasUnsavedChanges.bind(this);
    this.isEditing = this.isEditing.bind(this);
  }

  state: {
    editorState: EditorState,
    editMode: boolean,
    hasUnsavedChanges: boolean,
    outputState?: EditorState,
  };

  addIcon: (iconClass: string, outputsTo?: string) => ContentState;
  handleChange: (nextEditorState: EditorState) => void;
  handleCommonIconClick: (value: any) => void;
  handleEditModeToggle: () => void;
  handleSaveClick: () => void;
  hasUnsavedChanges: () => boolean;
  isEditing: () => boolean;

  createInitialContentState(): ContentState {
    const savedContentState: ?string = localStorage.getItem('contentState');

    if (savedContentState) {
      return convertFromRaw(JSON.parse(savedContentState));
    }

    return ContentState.createFromText('');
  }

  addIcon(iconClass: string, outputsTo?: string): void {
    if (this.isEditing()) {
      const nextEditorState: EditorState = addIcon(this.state.editorState, iconClass, outputsTo);

      this.updateEditorState(nextEditorState);
    }
  }

  isEditing(): boolean {
    return this.state.editMode;
  }

  hasUnsavedChanges(): boolean {
    return this.state.hasUnsavedChanges;
  }

  handleChange(nextEditorState: EditorState): void {
    if (this.isEditing()) {
      this.updateEditorState(nextEditorState);
    }
  }

  updateEditorState(nextEditorState: EditorState): void {
    const { editorState: previousEditorState } = this.state;

    this.setState({
      editorState: nextEditorState,
      hasUnsavedChanges: (
        this.hasUnsavedChanges() ||
        previousEditorState.getCurrentContent() !== nextEditorState.getCurrentContent()
      ),
    });
  }

  handleCommonIconClick({ icon, outputsTo }: { icon: string, outputsTo?: string }): void {
    this.addIcon(icon, outputsTo);
  }

  handleEditModeToggle(): void {
    this.setState({ editMode: !this.isEditing() });

    if (this.isEditing()) {
      this.setState({
        outputState: EditorState.createWithContent(
          ContentState.createFromText(
            convertToAngry(this.state.editorState.getCurrentContent())
          )
        ),
      });
    }
  }

  handleSaveClick(): void {
    if (this.hasUnsavedChanges()) {
      this.setState({ hasUnsavedChanges: false });

      const { editorState } = this.state;

      localStorage.setItem('contentState', JSON.stringify(
        convertToRaw(editorState.getCurrentContent())
      ));
    }
  }

  render(): Element {
    const { editorState, outputState } = this.state;

    return (
      <div>
        <Toolbar
          addIcon={this.addIcon}
          isEditing={this.isEditing}
          handleCommonIconClick={this.handleCommonIconClick}
          handleEditModeToggle={this.handleEditModeToggle}
          handleSaveClick={this.handleSaveClick}
          hasUnsavedChanges={this.hasUnsavedChanges}
        />

        <div className={styles.editor}>
          <Editor
            editorState={this.isEditing() ? editorState : outputState}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default EditorPane;
