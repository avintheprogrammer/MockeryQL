/* eslint-disable import/prefer-default-export */

export function flatten(array = []) {
  return array.reduce((accumulator, currentValue) => {
    if (currentValue) return accumulator.concat(currentValue);
    return accumulator;
  }, []);
}
