// @flow
import {
  CharacterMetaList,
  ContentBlock,
  ContentState,
  Entity,
} from 'draft-js';
import { getEntityRanges } from 'draft-js-utils';

export default class AngryGenerator {
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
