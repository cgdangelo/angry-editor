// @flow
import {
  CompositeDecorator,
  Editor,
  EditorState,
} from 'draft-js';
import React, { Component, Element } from 'react';
import { MenuItem } from 'react-toolbox';

import addIcon from '../draft/modifiers/addIcon';
import findEntitiesByType from '../draft/findEntitiesByType';
import ButtonMenu from './ButtonMenu';
import Icon from './Icon';

import styles from './EditorPane.scss';

type IconMenu = Array<{
  label: string;
  icon: string;
  outputsTo?: string
}>;

const commonIcons: {
  Haste: IconMenu,
  Classes: IconMenu,
  Roles: IconMenu,
} = {
  Haste: [
    { label: 'Bloodlust', icon: 'spell_nature_bloodlust', outputsTo: '{bl}' },
    { label: 'Heroism', icon: 'ability_shaman_heroism', outputsTo: '{hero}' },
  ],

  Classes: [
    { label: 'Death Knight', icon: 'classicon_deathknight', outputsTo: '{deathknight}' },
    { label: 'Demon Hunter', icon: 'classicon_demonhunter', outputsTo: '{demonhunter}' },
    { label: 'Druid', icon: 'classicon_druid', outputsTo: '{druid}' },
    { label: 'Hunter', icon: 'classicon_hunter', outputsTo: '{hunter}' },
    { label: 'Mage', icon: 'classicon_mage', outputsTo: '{mage}' },
    { label: 'Monk', icon: 'classicon_monk', outputsTo: '{monk}' },
    { label: 'Paladin', icon: 'classicon_paladin', outputsTo: '{paladin}' },
    { label: 'Priest', icon: 'classicon_priest', outputsTo: '{priest}' },
    { label: 'Rogue', icon: 'classicon_rogue', outputsTo: '{rogue}' },
    { label: 'Shaman', icon: 'classicon_shaman', outputsTo: '{shaman}' },
    { label: 'Warlock', icon: 'classicon_warlock', outputsTo: '{warlock}' },
    { label: 'Warrior', icon: 'classicon_warrior', outputsTo: '{warrior}' },
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
  constructor() {
    super();

    const decorator = new CompositeDecorator([
      {
        strategy: findEntitiesByType('icon'),
        component: Icon,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCommonIconTap = this.handleCommonIconTap.bind(this);
  }

  state: {
    editorState: EditorState;
  };

  handleChange: (event: any) => void;
  handleCommonIconTap: (value: any) => void;

  props: any;

  addIcon(iconClass: string, outputsTo?: string): void {
    this.setState({ editorState: addIcon(this.state.editorState, iconClass, outputsTo) });
  }

  handleChange(editorState: EditorState): void {
    this.setState({ editorState });
  }

  handleCommonIconTap({ icon, outputsTo }: { icon: string; outputsTo?: string }): void {
    this.addIcon(icon, outputsTo);
  }

  render(): Element {
    const { editorState } = this.state;

    return (
      <div>
        <div className={styles.toolbar}>
          {Object.keys(commonIcons).map((iconGroup) => (
            <ButtonMenu
              id={`${iconGroup.toLowerCase()}Dropdown`}
              key={iconGroup}
              onSelect={this.handleCommonIconTap}
              style={{ textAlign: 'left' }}
              title={iconGroup}
            >
              {commonIcons[iconGroup].map(({ label, icon, outputsTo }, index) => (
                <MenuItem
                  key={index}
                  value={{ icon, outputsTo }}
                >
                  {label}
                </MenuItem>
              ))}
            </ButtonMenu>
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
