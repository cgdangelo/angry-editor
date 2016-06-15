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
import { Button, MenuItem, Switch } from 'react-toolbox';

import addIcon from '../draft/modifiers/addIcon';
import convertToAngry from '../draft/convertToAngry';
import findEntitiesByType from '../draft/findEntitiesByType';
import Autocomplete from './Autocomplete';
import ButtonMenu from './ButtonMenu';
import Icon, { commonIcons } from './Icon';
import iconList from '../iconList';

import styles from './EditorPane.scss';

class EditorPane extends Component {
  constructor(props: any) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findEntitiesByType('icon'),
        component: Icon.fromEntity,
      },
    ]);

    const contentState = this.createInitialContentState();

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
  }

  state: {
    editorState: EditorState,
    editMode: boolean,
    outputState?: EditorState,
    hasUnsavedChanges: boolean,
  };

  addIcon: (iconClass: string, outputsTo?: string) => ContentState;
  handleChange: (nextEditorState: EditorState) => void;
  handleCommonIconClick: (value: any) => void;
  handleEditModeToggle: () => void;
  handleSaveClick: () => void;

  props: any;

  createInitialContentState(): ContentState {
    const savedContentState = localStorage.getItem('contentState');

    if (savedContentState) {
      return convertFromRaw(JSON.parse(savedContentState));
    }

    return ContentState.createFromText('');
  }

  addIcon(iconClass: string, outputsTo?: string): void {
    if (this.isEditing()) {
      const nextEditorState = addIcon(this.state.editorState, iconClass, outputsTo);

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

  handleCommonIconClick({
    icon,
    outputsTo,
  }: {
    icon: string,
    outputsTo?: string
  }): void {
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
        <div className={styles.toolbar}>
          {Object.keys(commonIcons).map((iconGroup) => (
            <ButtonMenu
              className={styles.commonIconMenu}
              disabled={!this.isEditing()}
              id={`${iconGroup.toLowerCase()}Dropdown`}
              key={iconGroup}
              onSelect={this.handleCommonIconClick}
              title={iconGroup}
            >
              {commonIcons[iconGroup].map(({ label, icon, outputsTo }, index) => (
                <MenuItem
                  key={index}
                  value={{ icon, outputsTo }}
                >
                  {label}
                  <Icon className={styles.commonIcon} iconClass={icon} />
                </MenuItem>
              ))}
            </ButtonMenu>
          ))}

          <Autocomplete
            addIcon={this.addIcon}
            multiple={false}
            placeholder="Search for icon"
            selectedPosition={null}
            source={iconList}
          />

          <Switch
            checked={this.isEditing()}
            label="Edit mode"
            onChange={this.handleEditModeToggle}
            theme={{ field: styles.editModeSwitch }}
          />

          <Button
            primary
            raised
            disabled={!this.hasUnsavedChanges()}
            onClick={this.handleSaveClick}
          >
            Save
          </Button>
        </div>

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
