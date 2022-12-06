import { readFileSync } from 'fs';
import { join } from 'path';

const crabs: number[] = readFileSync(join(__dirname, 'input.txt'), 'utf8')
  .split(',')
  .map((x) => parseInt(x));

function calculateFuelCost(crabs: number[], target: number, constantRate: boolean): number {
  return crabs.reduce((acc, crab) => {
    const distance = Math.abs(target - crab);
    return (acc += constantRate ? distance : (distance * (distance + 1)) / 2);
  }, 0);
}

let constantRateCost: number[] = [];
let nonConstantRateCost: number[] = [];
for (let i = Math.min(...crabs); i <= Math.max(...crabs); i++) {
  constantRateCost.push(calculateFuelCost(crabs, i, true));
  nonConstantRateCost.push(calculateFuelCost(crabs, i, false));
}

console.log(`The cheapest fuel usage at a constant rate is ${Math.min(...constantRateCost)} fuel.`);
console.log(`The cheapest fuel usage at a non-constant rate is ${Math.min(...nonConstantRateCost)} fuel.`);
