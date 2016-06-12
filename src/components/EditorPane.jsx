// @flow
import {
  CharacterMetadata,
  CharacterMetaList,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  Entity,
  convertToRaw,
} from 'draft-js';
import { getEntityRanges } from 'draft-js-utils';
import React, { Component, Element } from 'react';
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

class AngryGenerator {
  blocks: Array<ContentBlock>;
  contentState: ContentState;
  currentBlock: number;
  output: Array<string>;
  totalBlocks: number;

  constructor(contentState: ContentState) {
    this.contentState = contentState;
  }

  processBlock(): void {
    const block = this.blocks[this.currentBlock];

    this.output.push(this.renderBlockContent(block));

    this.currentBlock += 1;
  }

  renderBlockContent(block: ContentBlock): string {
    const blockText: string = block.getText();
    const charMetaList: CharacterMetaList = block.getCharacterList();
    const entityPieces: Array<any> = getEntityRanges(blockText, charMetaList);

    return entityPieces.map(([entityKey, stylePieces]) => {
      const content: string = stylePieces.map(([text]): string => (text)).join('');
      const entity: ?Entity = entityKey ? Entity.get(entityKey) : null;

      if (!entity) {
        return content;
      }

      const entityType: ?string = (entity === null) ? null : entity.getType();

      if (entity && entityType !== null && entityType === 'icon') {
        const { iconClass, outputsTo }: { iconClass: string, outputsTo: string } = entity.getData();

        return outputsTo || `{icon ${iconClass}}`;
      }

      return content;
    }).join('');
  }

  generate(): string {
    this.output = [];
    this.blocks = this.contentState.getBlocksAsArray();
    this.totalBlocks = this.blocks.length;
    this.currentBlock = 0;

    while (this.currentBlock < this.totalBlocks) {
      this.processBlock();
    }

    return this.output.join('\n').trim();
  }
}

const findIconEntities = (contentBlock: ContentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character: CharacterMetadata): boolean => {
      const entityKey: ?string = character.getEntity();

      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'icon'
      );
    },
    callback
  );
};

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
  constructor() {
    super();

    const decorator = new CompositeDecorator([
      {
        strategy: findIconEntities,
        component: Icon,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCommonIconTap = this.handleCommonIconTap.bind(this);
    this.logRaw = this.logRaw.bind(this);
    this.logState = this.logState.bind(this);
    this.logAngry = this.logAngry.bind(this);
  }

  state: {
    editorState: EditorState;
  };

  handleChange: (event: any) => void;
  handleCommonIconTap: (event: any) => void;
  logRaw: () => void;
  logState: () => void;
  logAngry: () => void;

  props: any;

  addIcon(iconClass: string, outputsTo?: string): void {
    this.setState({ editorState: addIcon(this.state.editorState, iconClass, outputsTo) });
  }

  handleChange(editorState: EditorState): void {
    this.setState({ editorState });
  }

  handleCommonIconTap(event: any): void {
    const { icon, outputsTo } = event.target.dataset;

    this.addIcon(icon, outputsTo);
  }

  logRaw(): void {
    console.log(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  logState(): void {
    console.log(this.state.editorState.toJS());
  }

  logAngry(): void {
    console.log(new AngryGenerator(this.state.editorState.getCurrentContent()).generate());
  }

  render(): Element {
    const { editorState } = this.state;

    return (
      <div>
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.logRaw}>Log Raw</Button>
            <Button onClick={this.logState}>Log State</Button>
            <Button onClick={this.logAngry}>Log Angry</Button>
          </ButtonGroup>

          {Object.keys(commonIcons).map((iconGroup) => (
            <DropdownButton
              id={`${iconGroup.toLowerCase()}Dropdown`}
              key={iconGroup}
              title={iconGroup}
            >
              {commonIcons[iconGroup].map(({ label, icon, outputsTo }, index) => (
                <MenuItem
                  data-icon={icon}
                  data-outputs-to={outputsTo}
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
