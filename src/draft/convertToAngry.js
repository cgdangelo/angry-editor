// @flow
import { ContentState } from 'draft-js';

import AngryGenerator from './AngryGenerator';

export default function convertToAngry(contentState: ContentState): string {
  return new AngryGenerator(contentState).generate();
}
