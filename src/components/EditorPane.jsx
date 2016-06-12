import React, { Component } from 'react';
import {
  CompositeDecorator,
  Editor,
  EditorState,
  Entity,
  convertToRaw,
} from 'draft-js';

import addIcon from '../modifiers/addIcon';
import Icon from './Icon';

import styles from './EditorPane.scss';

const findIconEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();

      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'icon'
      );
    },
    callback
  );
};

const commonIcons = [
  // Lust
  { label: 'Bloodlust', icon: 'spell_nature_bloodlust', outputsTo: '{bl}' },
  { label: 'Heroism', icon: 'ability_shaman_heroism', outputsTo: '{hero}' },

  // Classes
  { label: 'Death Knight', icon: 'classicon_deathknight' },
  { label: 'Demon Hunter', icon: 'classicon_demonhunter' },
  { label: 'Druid', icon: 'classicon_druid' },
  { label: 'Hunter', icon: 'classicon_hunter' },
  { label: 'Mage', icon: 'classicon_mage' },
  { label: 'Monk', icon: 'classicon_monk' },
  { label: 'Paladin', icon: 'classicon_paladin' },
  { label: 'Priest', icon: 'classicon_priest' },
  { label: 'Rogue', icon: 'classicon_rogue' },
  { label: 'Shaman', icon: 'classicon_shaman' },
  { label: 'Warlock', icon: 'classicon_warlock' },
  { label: 'Warrior', icon: 'classicon_warrior' },
];

export default class EditorPane extends Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findIconEntities,
        component: Icon,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
    };

    this.handleChange = ::this.handleChange;
    this.handleCommonIconTap = ::this.handleCommonIconTap;
    this.logRaw = ::this.logRaw;
    this.logState = ::this.logState;
  }

  addIcon(iconClass) {
    this.setState({ editorState: addIcon(this.state.editorState, iconClass) });
  }

  handleChange(editorState) {
    this.setState({ editorState });
  }

  handleCommonIconTap(event) {
    const { icon } = event.target.dataset;

    this.addIcon(icon);
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
          {commonIcons.map(({ label, icon }, index) => (
            <button
              data-icon={icon}
              key={index}
              onClick={this.handleCommonIconTap}
            >
              {label}
            </button>
          ))}
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
