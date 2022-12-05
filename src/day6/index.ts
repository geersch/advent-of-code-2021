import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt'), { encoding: 'utf8' });

const state = Array(9).fill(0);

data
  .split(/\n/)
  .flatMap((l) => l.split(','))
  .map((i) => parseInt(i, 10))
  .forEach((i) => (state[i] += 1));

function getTotal(school: number[], days: number): number {
  for (let day = 1; day <= days; day++) {
    let spawn = school[0];
    school.push(school.shift()!);
    school[6] += spawn;
  }
  return school.reduce((acc, curr) => (acc += curr), 0);
}

console.log(`There are ${getTotal([...state], 80)} fish after 80 days.`);
console.log(`There are ${getTotal([...state], 256)} fish after 256 days.`);
