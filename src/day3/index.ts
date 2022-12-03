import { readFileSync } from 'fs';
import { join } from 'path';

type BitCount = {
  one: number;
  zero: number;
};

const data = readFileSync(join(__dirname, 'input.txt'), {
  encoding: 'utf8',
  flag: 'r',
});

const items: string[] = data.split(/\n/);

/**
 * PART 1
 */
function countBits(items: string[]): BitCount[] {
  const count: BitCount[] = [];
  items.forEach((item: string) => {
    for (let [index, value] of [...item].entries()) {
      if (!count[index]) {
        count[index] = { one: 0, zero: 0 };
      }
      const bit = parseInt(value, 10);
      if (bit === 1) {
        count[index].one += 1;
      } else {
        count[index].zero += 1;
      }
    }
  });
  return count;
}

const count = countBits(items);

const ɣ = parseInt(
  count.reduce((acc, { one, zero }) => (acc += one > zero ? '1' : '0'), ''),
  2
);
const ε = parseInt(
  count.reduce((acc, { one, zero }) => (acc += one < zero ? '1' : '0'), ''),
  2
);

console.log(`The power consumption of the submarine is ${ɣ * ε}.`);

/**
 * PART 2
 */
function filter(
  input: string[],
  mostSignificant: boolean,
  index: number = 0
): number {
  let filteredItems: string[] = [...input];

  const count = countBits(filteredItems);
  const { one, zero } = count[index];

  filteredItems = filteredItems.filter((item) => {
    return mostSignificant
      ? one > zero || one === zero
        ? item[index] === '1'
        : item[index] === '0'
      : one < zero
      ? item[index] === '1'
      : item[index] === '0';
  });

  if (filteredItems.length === 1) {
    return parseInt(filteredItems[0], 2);
  }

  return filter(filteredItems, mostSignificant, index + 1);
}

const oxygen = filter(items, true);
const co2Scrubber = filter(items, false);

console.log(`The life support rating is ${oxygen * co2Scrubber}.`);
