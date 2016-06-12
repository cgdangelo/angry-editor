import {
  CompositeDecorator,
  Editor,
  EditorState,
  Entity,
  convertToRaw,
} from 'draft-js';
import React, { Component } from 'react';
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';

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

const commonIcons = {
  Haste: [
    { label: 'Bloodlust', icon: 'spell_nature_bloodlust', outputsTo: '{bl}' },
    { label: 'Heroism', icon: 'ability_shaman_heroism', outputsTo: '{hero}' },
  ],

  Classes: [
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
  ],

  Markers: [
    { label: 'Star', icon: 'iconsmall_raidstar', outputsTo: '{star}' },
    { label: 'Circle', icon: 'iconsmall_raidcircle', outputsTo: '{circle}' },
    { label: 'Diamond', icon: 'iconsmall_raiddiamond', outputsTo: '{diamond}' },
    { label: 'Triangle', icon: 'iconsmall_raidtriangle', outputsTo: '{triangle}' },
    { label: 'Moon', icon: 'iconsmall_raidmoon', outputsTo: '{moon}' },
    { label: 'Square', icon: 'iconsmall_raidsquare', outputsTo: '{square}' },
    { label: 'Cross', icon: 'iconsmall_raidcross', outputsTo: '{cross}' },
    { label: 'Skull', icon: 'iconsmall_raidskull', outputsTo: '{skull}' },
  ],

  Roles: [
    { label: 'Tank', icon: 'iconsmall_roletank', outputsTo: '{tank}' },
    { label: 'Healer', icon: 'iconsmall_rolehealer', outputsTo: '{heal}' },
    { label: 'DPS', icon: 'iconsmall_roledps', outputsTo: '{dps}' },
  ],
};

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
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.logRaw}>Log Raw</Button>
            <Button onClick={this.logState}>Log State</Button>
          </ButtonGroup>

          {Object.keys(commonIcons).map((iconGroup) => (
            <DropdownButton
              id={`${iconGroup.toLowerCase()}Dropdown`}
              key={iconGroup}
              title={iconGroup}
            >
              {commonIcons[iconGroup].map(({ label, icon }, index) => (
                <MenuItem
                  data-icon={icon}
                  key={index}
                  onClick={this.handleCommonIconTap}
                >
                  {label}
                </MenuItem>
              ))}
            </DropdownButton>
          ))}
        </ButtonToolbar>

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
