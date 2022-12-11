import { readFileSync } from 'fs';
import { join } from 'path';

type Bracket = { opening: string; closing: string; syntaxPoints: number; autocompletePoints: number };
type Block = { bracket: Bracket; blocks: Block[]; parent?: Block };

const brackets: Bracket[] = [
  { opening: '(', closing: ')', syntaxPoints: 3, autocompletePoints: 1 },
  { opening: '[', closing: ']', syntaxPoints: 57, autocompletePoints: 2 },
  { opening: '{', closing: '}', syntaxPoints: 1197, autocompletePoints: 3 },
  { opening: '<', closing: '>', syntaxPoints: 25137, autocompletePoints: 4 },
];

let syntaxScore = 0;
let autocompleteScores: number[] = [];
for (const line of readFileSync(join(__dirname, 'input.txt'), 'utf8').split(/\n/)) {
  let cwb: Block | undefined;
  let valid = true;
  let openBlocks: Block[] = [];
  for (let char of line) {
    const bracket = brackets.find((b) => b.opening === char || b.closing === char);
    if (!bracket) {
      continue;
    }
    if (bracket.opening === char) {
      const block: Block = { bracket, blocks: [], parent: cwb };
      cwb?.blocks.push(block);
      cwb = block;
      openBlocks.push(cwb);
    } else if (cwb && bracket.closing === char) {
      if (cwb.bracket.closing === char) {
        openBlocks.splice(openBlocks.indexOf(cwb), 1);
        cwb = cwb.parent;
      } else {
        valid = false;
        syntaxScore += bracket.syntaxPoints;
        break;
      }
    }
  }
  if (valid) {
    autocompleteScores.push(openBlocks.reverse().reduce((acc, curr) => acc * 5 + curr.bracket.autocompletePoints, 0));
  }
}

const autocompleteScore = autocompleteScores.sort((a, b) => b - a).splice(autocompleteScores.length / 2, 1);
console.log(`The total syntax error score is ${syntaxScore}.`);
console.log(`The total autocomplete score is ${autocompleteScore}.`);
