import { readFileSync } from 'fs';
import { join } from 'path';

const data: string[] = readFileSync(join(__dirname, 'input.txt'), 'utf8').split(/\n/);

type Signal = { input: string[]; output: string[] };

function sort(value: string): string {
  return [...value].sort().join('');
}

const signals: Signal[] = [];
data.forEach((line) => {
  const [input, output] = line.split('|');
  signals.push({ input: input.trim().split(' ').map(sort), output: output.trim().split(' ').map(sort) });
});

/***
 * PART 1
 */
const total1 = signals.reduce((acc, signal) => {
  signal.output.forEach((segment) => {
    if (segment.length === 2 || segment.length === 3 || segment.length === 4 || segment.length === 7) {
      acc += 1;
    }
  });
  return acc;
}, 0);

console.log(`The digits 1, 4, 7 or 8 appear ${total1} times.`);

/**
 * PART 2
 */
let total2 = 0;
signals.forEach(({ input, output }) => {
  const fiveChars = input.filter((s) => s.length === 5);
  const sixChars = input.filter((s) => s.length === 6);
  const _1 = input.find((s) => s.length === 2)!;
  const _4 = input.find((s) => s.length === 4)!;
  const _7 = input.find((s) => s.length === 3)!;
  const _8 = input.find((s) => s.length === 7)!;
  const _2 = fiveChars.find((s) => _4.split('').filter((c) => s.indexOf(c) !== -1).length === 2)!;
  const _3 = fiveChars.find(
    (s) =>
      _1.split('').every((c) => s.indexOf(c) !== -1) &&
      _4.split('').some((c) => s.indexOf(c) === -1) &&
      _7.split('').every((c) => s.indexOf(c) !== -1),
  )!;
  const _5 = fiveChars.find((s) => s !== _2 && s !== _3)!;
  const _6 = sixChars.find(
    (s) =>
      _1.split('').some((c) => s.indexOf(c) === -1) &&
      _4.split('').some((c) => s.indexOf(c) === -1) &&
      _7.split('').some((c) => s.indexOf(c) === -1),
  )!;
  const _9 = sixChars.find(
    (s) =>
      _1.split('').every((c) => s.indexOf(c) !== -1) &&
      _4.split('').every((c) => s.indexOf(c) !== -1) &&
      _7.split('').every((c) => s.indexOf(c) !== -1),
  )!;
  const _0 = sixChars.find((s) => s !== _6 && s !== _9)!;

  const digits = [_0, _1, _2, _3, _4, _5, _6, _7, _8, _9];
  const value = output.reduce((acc, current) => (acc += digits.findIndex((d) => d === current)), '');
  total2 += parseInt(value, 10);
});

console.log(`The sum of all the output values is ${total2}.`);
