import { readFileSync } from 'fs';
import { join } from 'path';

type Point = { x: number; y: number; value: number; basin?: number };

const heightmap: Point[][] = readFileSync(join(__dirname, 'input.txt'), 'utf8')
  .split(/\n/)
  .map((line, y) => line.split('').map((d, x) => ({ x, y, value: parseInt(d) })));

function getNeighbours(heightmap: Point[][], x: number, y: number): Point[] {
  return [
    ...(y > 0 ? [heightmap[y - 1][x]] : []),
    ...(y < heightmap.length - 1 ? [heightmap[y + 1][x]] : []),
    ...(x > 0 ? [heightmap[y][x - 1]] : []),
    ...(x < heightmap[y].length - 1 ? [heightmap[y][x + 1]] : []),
  ];
}

const lowPoints: Point[] = [];
for (const [y, row] of heightmap.entries()) {
  for (const [x, currPoint] of row.entries()) {
    const neighbours = getNeighbours(heightmap, x, y);
    if (neighbours.every((neighbour) => currPoint.value < neighbour.value)) {
      lowPoints.push(currPoint);
    }
  }
}

const riskLevel = lowPoints.reduce((acc, curr) => (acc += curr.value + 1), 0);
console.log(`The sum of the risk levels of all low points is ${riskLevel}.`);

function calcBasinSize(heightmap: Point[][], point: Point, basin?: number): number {
  let size = 0;
  if (point.basin === undefined) {
    point.basin = basin;
    size += 1;
    getNeighbours(heightmap, point.x, point.y)
      .filter((neighbour) => neighbour.value < 9)
      .forEach((neighbour) => (size += calcBasinSize(heightmap, neighbour, basin)));
  }
  return size;
}

const sizeOfBasins = lowPoints
  .reduce<number[]>((acc, curr, index) => {
    acc.push(calcBasinSize(heightmap, curr, index));
    return acc;
  }, [])
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((acc, curr) => (acc || 1) * curr, 0);
console.log(`If you multiply the size of the three largest basins you get ${sizeOfBasins}.`);
