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
let position = 0;
let depth = 0;
items.forEach((item: string) => {
  const [command, value] = item.split(' ');
  const x = parseInt(value, 10);
  switch (command) {
    case 'forward': {
      position += x;
      break;
    }
    case 'down': {
      depth += x;
      break;
    }
    case 'up': {
      depth -= x;
      break;
    }
  }
});

console.log(`Horizontal position multiplied by depth is ${position * depth}.`);

/**
 * PART 2
 */
position = 0;
depth = 0;
let aim = 0;
items.forEach((item: string) => {
  const [command, value] = item.split(' ');
  const x = parseInt(value, 10);
  switch (command) {
    case 'forward': {
      position += x;
      depth += x * aim;
      break;
    }
    case 'down': {
      aim += x;
      break;
    }
    case 'up': {
      aim -= x;
      break;
    }
  }
});

console.log(`Horizontal position multiplied by depth is ${position * depth}.`);
