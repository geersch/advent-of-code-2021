import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt'), {
  encoding: 'utf8',
  flag: 'r',
});

const items: string[] = data.split(/\n/);

/**
 * PART 1
 */
let count1 = 0;
let previous = 0;
items.forEach((item: string, index) => {
  const value = parseInt(item, 10);
  if (index > 0 && value > previous) {
    count1++;
  }
  previous = value;
});

console.log(
  `There are ${count1} measurements that are larger than the previous measurement.`
);

/**
 * PART 2
 */
let count2 = 0;
previous = 0;
let window: number[] = [];
items.forEach((item: string, index) => {
  const value = parseInt(item, 10);
  window.push(value);
  if (window.length > 3) {
    window.shift();
  }
  if (window.length === 3) {
    const sum = window.reduce((acc, current) => acc + current, 0);
    if (index > 2 && sum > previous) {
      count2++;
    }
    previous = sum;
  }
});

console.log(`There are ${count2} sums that are larger than the previous sum.`);
