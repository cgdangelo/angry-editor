// @flow
import {
  CharacterMetadata,
  ContentBlock,
  Entity,
} from 'draft-js';

export default function
  findEntitiesByType(type: string): (contentBlock: ContentBlock, callback: any) => void {
  return (contentBlock: ContentBlock, callback): void => {
    contentBlock.findEntityRanges(
      (character: CharacterMetadata): boolean => {
        const entityKey: ?string = character.getEntity();

        return (
          entityKey !== null &&
          Entity.get(entityKey).getType() === type
        );
      },
      callback
    );
  };
}
