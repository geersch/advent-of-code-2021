import { readFileSync } from 'fs';
import { join } from 'path';

const data = readFileSync(join(__dirname, 'input.txt'), {
  encoding: 'utf8',
  flag: 'r',
});

const lines: string[] = data.split(/\n/);

type Point = {
  x: number;
  y: number;
};

enum Direction {
  Left,
  Right,
  Down,
  DownLeft,
  DownRight,
  Up,
  UpLeft,
  UpRight,
}

class Segment {
  constructor(public readonly from: Point, public readonly to: Point) {}

  get direction(): Direction {
    if (this.from.y === this.to.y) {
      return this.from.x < this.to.x ? Direction.Left : Direction.Right;
    } else if (this.from.x === this.to.x) {
      return this.from.y < this.to.y ? Direction.Down : Direction.Up;
    }
    const right = this.to.x > this.from.x;
    if (this.from.y < this.to.y) {
      return right ? Direction.DownRight : Direction.DownLeft;
    }
    return right ? Direction.UpRight : Direction.UpLeft;
  }
}

let segments: Segment[] = [];

lines.forEach((item: string) => {
  const [from, to] = item.split('->');
  const [x1, y1] = from
    .trim()
    .split(',')
    .map((x) => parseInt(x, 10));
  const [x2, y2] = to
    .trim()
    .split(',')
    .map((x) => parseInt(x, 10));
  segments.push(new Segment({ x: x1, y: y1 }, { x: x2, y: y2 }));
});

function getOverlappingPoints(options: { diagonal: boolean }): number {
  const points: Point[] = [];

  segments.forEach((segment) => {
    const { direction } = segment;
    if (direction === Direction.Left || direction === Direction.Right) {
      let min = segment.from.x;
      let max = segment.to.x;
      if (min > max) {
        [min, max] = [max, min];
      }
      for (let x = min; x <= max; x++) {
        points.push({ x, y: segment.from.y });
      }
    } else if (direction === Direction.Down || direction === Direction.Up) {
      let min = segment.from.y;
      let max = segment.to.y;
      if (min > max) {
        [min, max] = [max, min];
      }
      for (let y = min; y <= max; y++) {
        points.push({ x: segment.from.x, y });
      }
    } else if (options.diagonal) {
      if (segment.direction === Direction.DownLeft) {
        let y = segment.from.y;
        for (let x = segment.from.x; x >= segment.to.x; x--) {
          points.push({ x, y });
          y += 1;
        }
      } else if (segment.direction === Direction.UpLeft) {
        let y = segment.from.y;
        for (let x = segment.from.x; x >= segment.to.x; x--) {
          points.push({ x, y });
          y -= 1;
        }
      } else if (segment.direction === Direction.DownRight) {
        let y = segment.from.y;
        for (let x = segment.from.x; x <= segment.to.x; x++) {
          points.push({ x, y });
          y += 1;
        }
      } else if (segment.direction === Direction.UpRight) {
        let y = segment.from.y;
        for (let x = segment.from.x; x <= segment.to.x; x++) {
          points.push({ x, y });
          y -= 1;
        }
      }
    }
  });

  const count = points.reduce<Record<string, number>>((acc, point) => {
    const key = `x=${point.x},${point.y}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return [...Object.values(count)].filter((x) => x > 1).length;
}

const total1 = getOverlappingPoints({ diagonal: false });
console.log(`1. There are ${total1} overlapping points.`);

const total2 = getOverlappingPoints({ diagonal: true });
console.log(`2. There are ${total2} overlapping points.`);
