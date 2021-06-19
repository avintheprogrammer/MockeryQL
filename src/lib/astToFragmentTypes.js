/* eslint-disable import/prefer-default-export, consistent-return */
import { isEmptyObject } from './object';

function toFragmentTypes(inlineFragment) {
  const { name } = (inlineFragment || {}).typeCondition || {};
  return (name || {}).value;
}

function isInlineFragmentSelection(selection) {
  const { kind } = selection || {};
  return kind === 'InlineFragment';
}

function isDesiredSelection({ selection, desiredSelection }) {
  const { value } = (selection || {}).name || {};
  return value === desiredSelection;
}

export function findDesiredFieldNode({ selectionSet = {}, desiredSelection }) {
  const { selections = [] } = selectionSet;
  if (!selections.length) return;

  return selections.reduce((resolved, selection) => {
    if (isDesiredSelection({ selection, desiredSelection })) {
      return selection;
    }

    if (selection.selectionSet && isEmptyObject(resolved)) {
      const desiredFieldNode = findDesiredFieldNode({
        selectionSet: selection.selectionSet,
        desiredSelection,
      });

      if (desiredFieldNode) resolved = desiredFieldNode; // eslint-disable-line
    }

    return resolved;
  }, {});
}

/**
 * Converts graphQL query ast to a consumable object
 * @todo: cleanup
 * @param {Array.<object>} ast - e.g. 'info.fieldNodes'
 * @returns {object}
 */
export default function astToFragmentTypes({ ast = [], desiredSelection = 'assets' }) {
  if (!ast.length) return;

  const desiredFieldNode = findDesiredFieldNode({
    selectionSet: ast[0].selectionSet,
    desiredSelection,
  });

  const { selectionSet } = desiredFieldNode || {};
  const { selections: desiredSelections = [] } = selectionSet || {};
  const inlineFragments = desiredSelections.filter(isInlineFragmentSelection);
  const fragments = inlineFragments.map(toFragmentTypes);
  return fragments;
}

export function selectionSetToFragmentTypes({ selectionSet = {} }) {
  const { selections } = selectionSet;
  const inlineFragments = selections.filter(isInlineFragmentSelection);
  const fragments = inlineFragments.map(toFragmentTypes);
  return fragments;
}
