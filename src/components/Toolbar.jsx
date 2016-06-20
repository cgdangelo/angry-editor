import { ContentState, EditorState } from 'draft-js';
import React, { Element } from 'react';
import { Button, MenuItem, Switch } from 'react-toolbox';

import Autocomplete from './Autocomplete';
import ButtonMenu from './ButtonMenu';
import Icon from './Icon';

import iconList from '../iconList';
import styles from './Toolbar.scss';

type CommonIconGroup =
  Array<{
    label: string,
    icon: string,
    outputsTo?: string,
  }>;

const commonIcons: {
  Haste: CommonIconGroup,
  Classes: CommonIconGroup,
  Roles: CommonIconGroup,
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

const Toolbar = ({
  addIcon,
  isEditing,
  handleCommonIconClick,
  handleEditModeToggle,
  handleSaveClick,
  hasUnsavedChanges,
}: {
  addIcon: (editorState: EditorState, iconClass: String, outputsTo?: String) => EditorState,
  isEditing: boolean,
  addIcon: (iconClass: string, outputsTo?: string) => ContentState,
  handleCommonIconClick: (value: any) => void,
  handleEditModeToggle: () => void,
  handleSaveClick: () => void,
  hasUnsavedChanges: () => boolean,
}): Element => (
  <div className={styles.toolbar}>
    {Object.keys(commonIcons).map((iconGroup: string): Array<Element> => (
      <ButtonMenu
        className={styles.commonIconMenu}
        disabled={!isEditing}
        id={`${iconGroup.toLowerCase()}Dropdown`}
        key={iconGroup}
        onSelect={handleCommonIconClick}
        title={iconGroup}
      >
        {commonIcons[iconGroup].map((
          { label, icon, outputsTo }: CommonIconGroup,
          index: number,
        ): Array<Element> => (
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
      addIcon={addIcon}
      disabled={!isEditing()}
      source={iconList}
    />

    <Switch
      checked={isEditing()}
      label="Edit mode"
      onChange={handleEditModeToggle}
      theme={{ field: styles.editModeSwitch }}
    />

    <Button
      primary
      raised
      disabled={!hasUnsavedChanges()}
      onClick={handleSaveClick}
    >
      Save
    </Button>
  </div>
);

export default Toolbar;
