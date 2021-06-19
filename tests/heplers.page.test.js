/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
import { resolveTagNameFormatted } from '../src/helpers/page';

const TAG_NAME_MAX_CHARS = 15;

describe('helpers page test', () => {
  it('should return formatted version of tag name - alphanum, multispaces into single space', () => {
  	const tagName = 'tag Name#@  03 42!* 		= text';
  	const tagNameFormatted = resolveTagNameFormatted(tagName);
  	const expected = 'tag name 03 42 text';

  	expect(tagNameFormatted).toEqual(expected);
  });
  it('should return length < = page.TAG_NAME_MAX_CHARS', () => {
  	const tagName = 'tag name#@  03 42!* 		= text';
  	const tagNameFormatted = resolveTagNameFormatted(tagName, true);

  	expect(tagNameFormatted.length).toBeLessThanOrEqual(TAG_NAME_MAX_CHARS);
  });
});
