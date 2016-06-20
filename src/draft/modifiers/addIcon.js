import { EditorState, Entity, Modifier } from 'draft-js';

export default function addIcon(editorState: EditorState, iconClass: String, outputsTo?: String): EditorState {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const entityKey = Entity.create('icon', 'IMMUTABLE', { iconClass, outputsTo });

  const iconReplacedContent = Modifier.replaceText(
    contentState,
    selectionState,
    ' ',
    null,
    entityKey
  );

  const newEditorState = EditorState.push(
    editorState,
    iconReplacedContent,
    'insert-icon'
  );

  EditorState.forceSelection(
    newEditorState,
    iconReplacedContent.getSelectionAfter()
  );

  return newEditorState;
}
